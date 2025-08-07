import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    try {
        let { username, email, password } = await request.json();
        username = typeof username === 'string' ? username.trim() : '';
        email = typeof email === 'string' ? email.trim() : '';

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Username, email, and password are required' }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ $or: [{ username }, { email }] }).lean();
        if (existingUser) {
            return NextResponse.json({ message: 'User with that username or email already exists' }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });

        if (!JWT_SECRET) {
            return NextResponse.json({ message: 'Server error' }, { status: 500 });
        }

        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userData } = user.toObject();

        return NextResponse.json({ token, user: userData }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
    }
}
