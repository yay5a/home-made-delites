import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
	const auth = request.headers.get('authorization');
	if (!auth?.startsWith('Bearer ')) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	if (!JWT_SECRET) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	try {
		const token = auth.substring(7);
		const payload = jwt.verify(token, JWT_SECRET);

		await dbConnect();

		const user = await User.findById(payload.sub).select('-password').lean();
		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (err) {
		console.error(err);
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
}
