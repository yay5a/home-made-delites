import { NextResponse } from 'next/server';

/**
 * Middleware - currently disabled to avoid Edge Runtime issues with Mongoose
 * TODO: Implement Edge Runtime compatible rate limiting
 */
export async function middleware(request) {
	// Skip all processing for now to avoid Edge Runtime issues
	return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
};
