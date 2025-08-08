import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { checkRateLimit } from '@/lib/rateLimiter';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.ip;
        const { username, password } = await request.json();

        if (!username || typeof username !== 'string' || username.trim() === '' || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }

        if (!checkRateLimit(ip)) {
            return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
        }

        await dbConnect();

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        if (!JWT_SECRET) {
            return NextResponse.json({ message: 'Server error' }, { status: 500 });
        }

        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userData } = user.toObject();

        const res = NextResponse.json({ token, user: userData });
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
        return res
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Login failed' }, { status: 500 });
    }
}
