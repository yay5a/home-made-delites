import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await dbConnect();

        const existing = await User.findOne({ email }).lean();
        if (existing) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });

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
