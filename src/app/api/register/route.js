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
            console.warn('Registration failed: missing fields', { username, email });
            return NextResponse.json({ message: 'Registration failed' }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ $or: [{ username }, { email }] }).lean();
        if (existingUser) {
            console.warn('Registration failed: username or email already exists', { username, email });
            return NextResponse.json({ message: 'Registration failed' }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });

        if (!JWT_SECRET) {
            console.warn('Registration failed: TOKEN not set');
            return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
        }

        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userData } = user.toObject();

        const res = NextResponse.json({ token, user: userData }, { status: 201 });
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
        return res;
    } catch (err) {
        console.error('Registration failed: ', err);
        return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
    }
}
