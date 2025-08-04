import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import dbConnect from '@/lib/mongoose';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

const server = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: true,
	includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
});

// Create context function to provide authentication and database connection
const createContext = async ({ req }) => {
	try {
		await dbConnect();

		let user = null;
		// Handle both Next.js Request object and standard request formats
		const authHeader = req?.headers?.get
			? req.headers.get('authorization')
			: req?.headers?.authorization;

		const token = authHeader?.replace('Bearer ', '');

		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				user = await User.findById(decoded.userId);
			} catch (error) {
				console.log('Token verification failed:', error.message);
			}
		}

		return {
			user,
			req,
		};
	} catch (error) {
		console.error('Context creation failed:', error);
		throw error;
	}
};

const handler = startServerAndCreateNextHandler(server, {
	context: createContext,
});

export async function GET(request) {
	try {
		return handler(request);
	} catch (error) {
		console.error('GraphQL GET error:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function POST(request) {
	try {
		return handler(request);
	} catch (error) {
		console.error('GraphQL POST error:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
