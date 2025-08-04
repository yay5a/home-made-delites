import { NextResponse } from 'next/server';
import { ApiUsageTracker } from '@/utils/apiUsageTracker';

// Initialize API usage tracker
const apiTracker = new ApiUsageTracker();

/**
 * Middleware to enforce API rate limits
 * Checks both Edamam recipe API and Assistant API calls
 */
export async function middleware(request) {
	// Skip non-API routes
	if (!request.nextUrl.pathname.startsWith('/api/')) {
		return NextResponse.next();
	}

	try {
		// Check if this is an assistant API call
		const isAssistant = request.nextUrl.pathname.startsWith('/api/assistant/');

		// Get client IP for rate limiting (in production, use more reliable methods)
		const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

		// Check rate limits based on API type
		if (isAssistant) {
			// For assistant API calls
			const canUseAssistant = apiTracker.checkAssistantLimit(clientIp);
			if (!canUseAssistant) {
				return new NextResponse(
					JSON.stringify({
						error: 'Rate limit exceeded for assistant API. Please try again later.',
					}),
					{
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': '3600', // Try again in 1 hour
						},
					}
				);
			}
		} else if (request.nextUrl.pathname.startsWith('/api/recipes/')) {
			// For recipe API calls
			const canUseRecipeApi = apiTracker.checkRecipeApiLimit(clientIp);
			if (!canUseRecipeApi) {
				return new NextResponse(
					JSON.stringify({
						error: 'Rate limit exceeded for recipe API. Please try again later.',
					}),
					{
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': '60', // Try again in 1 minute
						},
					}
				);
			}
		}

		// Allow the request to proceed
		return NextResponse.next();
	} catch (error) {
		console.error('Rate limiting middleware error:', error);

		// Fail open - allow the request but log the error
		return NextResponse.next();
	}
}

// Configure middleware to run only on API routes
export const config = {
	matcher: '/api/:path*',
};
