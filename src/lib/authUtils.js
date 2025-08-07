import dbConnect from '@/lib/mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function initAuth(request) {
    if (!JWT_SECRET || JWT_SECRET.length < 20) {
        // Example robust secret check: min length
        return { error: { message: 'Invalid server config', status: 500 } };
    }
    await dbConnect();

    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
        return { error: { message: 'Unauthorized', status: 401 } };
    }

    const token = auth.substring(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return { payload, error: null };
    } catch (err) {
        return { error: { message: 'Unauthorized', status: 401 } };
    }
}
