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

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Generate token
		const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

		return NextResponse.json({ token });
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: 'Login failed' }, { status: 500 });
	}
}
