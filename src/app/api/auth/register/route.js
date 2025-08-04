import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
	try {
		const { email, password } = await request.json();

		await dbConnect();

		// Check if user exists
		const user = await User.findOne({ email });
		if (user) {
			return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const newUser = await User.create({
			email,
			password: hashedPassword,
		});

		// Generate token
		const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

		return NextResponse.json({ token });
	} catch (error) {
		console.error('Register error:', error);
		return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
	}
}
