import { NextResponse } from 'next/server';
import { API_LIMITS } from '@/config/apiLimits';

/**
 * In-memory rate limiting for Edge Runtime using Web Caches
 * Lightweight solution that doesn't require external services
 */

// Create caches for different time windows
const minuteWindowCache = new Map();
const dayWindowCache = new Map();
const monthWindowCache = new Map();

// Time constants in milliseconds
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const MONTH = 30 * DAY;

/**
 * Edge-compatible rate limiting middleware
 * Implements per-IP rate limiting with different time windows
 */
export async function middleware(request) {
	// Get client IP address
	const ip = request.ip || '127.0.0.1';

	// Skip rate limiting for static assets and non-API routes
	const url = new URL(request.url);
	if (!url.pathname.includes('/api/')) {
		return NextResponse.next();
	}

	const now = Date.now();
	let isRateLimited = false;
	let rateLimitType = '';

	// ===== MINUTE-BASED RATE LIMITING =====
	// Reset counters older than 1 minute
	for (const [key, value] of minuteWindowCache.entries()) {
		if (now - value.timestamp > MINUTE) {
			minuteWindowCache.delete(key);
		}
	}

	// Check/update minute-based limit
	{
		const minuteKey = `${ip}-minute`;
		const minuteData = minuteWindowCache.get(minuteKey) || { count: 0, timestamp: now };

		if (minuteData.count >= API_LIMITS.HITS_PER_MINUTE) {
			isRateLimited = true;
			rateLimitType = 'minute';
		} else {
			// Increment counter
			minuteData.count += 1;
			minuteWindowCache.set(minuteKey, minuteData);
		}
	}

	// ===== MONTH-BASED RATE LIMITING =====
	// Reset counters older than 1 month
	for (const [key, value] of monthWindowCache.entries()) {
		if (now - value.timestamp > MONTH) {
			monthWindowCache.delete(key);
		}
	}

	// Check/update month-based limit (for all API calls)
	if (!isRateLimited) {
		const monthKey = `${ip}-month`;
		const monthData = monthWindowCache.get(monthKey) || { count: 0, timestamp: now };

		if (monthData.count >= API_LIMITS.HITS_PER_MONTH) {
			isRateLimited = true;
			rateLimitType = 'month';
		} else {
			// Increment counter
			monthData.count += 1;
			monthWindowCache.set(monthKey, monthData);
		}
	}

	// Return rate limit response if needed
	if (isRateLimited) {
		const response = NextResponse.json(
			{
				error: `Rate limit exceeded: ${rateLimitType} quota reached`,
				type: rateLimitType,
			},
			{ status: 429 }
		);

		// Add rate limit headers
		response.headers.set(
			'X-RateLimit-Limit',
			rateLimitType === 'minute'
				? String(API_LIMITS.HITS_PER_MINUTE)
				: String(API_LIMITS.HITS_PER_MONTH)
		);
		response.headers.set('X-RateLimit-Remaining', '0');

		// Set retry-after header
		const retryAfter = rateLimitType === 'minute' ? '60' : '2592000'; // seconds
		response.headers.set('Retry-After', retryAfter);

		return response;
	}

	// Allow the request to proceed
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
