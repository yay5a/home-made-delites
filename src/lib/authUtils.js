import dbConnect from '@/lib/mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function initAuth(request) {
    if (!JWT_SECRET || JWT_SECRET.length < 20) {
        return { error: { message: 'Invalid server config', status: 500 } };
    }
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) {
        return { error: { message: 'Unauthorized', status: 401 } };
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload.exp <= Date.now() / 1000) {
            return { error: { message: 'Token expired', status: 401 } };
        }
        return { payload, error: null };
    } catch (err) {
        return { error: { message: 'Unauthorized', status: 401 } };
    }
}
