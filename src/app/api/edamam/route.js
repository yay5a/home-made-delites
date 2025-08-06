import { NextResponse } from 'next/server';

const rateLimitStore = new Map();

const WINDOW_SIZE = 60 * 1000; // 60s window
const MAX_REQUESTS = 10; // max calls per window

function getClientKey(request) {
	const xff = request.headers.get('x-forwarded-for');
	if (xff) return xff.split(',')[0].trim();
	return request.headers.get('host') || 'unknown';
}

export async function GET(request) {
	const clientKey = getClientKey(request);
	const now = Date.now();

	const timestamps = rateLimitStore.get(clientKey) || [];
	const recent = timestamps.filter((ts) => now - ts < WINDOW_SIZE);

	if (recent.length >= MAX_REQUESTS) {
		return NextResponse.json({ error: 'Rate limit exceeded. Try again in a moment.' }, { status: 429 });
	}

	recent.push(now);
	rateLimitStore.set(clientKey, recent);

	const { search } = Object.fromEntries(request.nextUrl.searchParams);
	if (typeof search !== 'string' || !search.trim()) {
		return NextResponse.json({ results: [] });
	}

	const appId = process.env.APP_ID;
	const apiKey = process.env.API_KEY;
	const url = new URL('https://api.edamam.com/api/recipes/v2');
	url.searchParams.set('q', search);
	url.searchParams.set('app_id', appId);
	url.searchParams.set('app_key', apiKey);

	const res = await fetch(url.toString());
	if (!res.ok) {
		return NextResponse.json({ error: 'Upstream API error' }, { status: res.status });
	}

	const data = await res.json();

	const results = Array.isArray(data.hits) ? data.hits.map((hit) => hit.recipe) : [];

	return NextResponse.json({ results });
}
