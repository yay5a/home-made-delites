import { NextResponse } from 'next/server';
import User from '@/models/User';
import { initAuth } from '@/lib/authUtils';

export async function GET(request) {
	const { payload, error } = await initAuth(request);
	if (error) {
		return NextResponse.json({ message: error.message }, { status: error.status });
	}

	try {
		const user = await User.findById(payload.sub).select('-password').lean();
		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}
		return NextResponse.json(user);
	} catch (err) {
		console.error(err);
		return NextResponse.json({ message: 'Server error' }, { status: 500 });
	}
}
