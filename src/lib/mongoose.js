// Database connection utility
import mongoose from 'mongoose';

// Prevent Mongoose from being used in the browser
if (typeof window !== 'undefined') {
	throw new Error('Mongoose cannot be used in the browser.');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/home-made-delites';

// Initialize mongoose models object if it doesn't exist
if (!mongoose.models) {
	mongoose.models = {};
}

// Cache the connection
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 * @returns {Promise<Mongoose>} MongoDB connection
 */
async function dbConnect() {
	// If connection exists, return it
	if (cached.conn) {
		return cached.conn;
	}

	// If promise exists, wait for it to resolve
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				console.log('Connected to MongoDB');
				return mongoose;
			})
			.catch((error) => {
				console.error('Error connecting to MongoDB:', error);
				throw error;
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
