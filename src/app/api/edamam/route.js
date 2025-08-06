import { NextResponse } from 'next/server';

const rateLimitStore = new Map();
const WINDOW_SIZE = 60 * 1000;
const MAX_REQUESTS = 10;

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
	const apiId = process.env.API_ID;
	const apiKey = process.env.API_KEY;
	const raw = process.env.API_URL;

	if (!raw || !apiId || !apiKey) {
		return NextResponse.json({ error: 'API configuration is missing.' }, { status: 500 });
	}

	let url;
	try {
		url = new URL(raw);
	} catch (err) {
		console.error('Invalid API_URL:', raw, err);
		return NextResponse.json({ error: 'Server misconfiguration: bad API_URL' }, { status: 500 });
	}

	url.searchParams.set('q', search);
	url.searchParams.set('app_id', apiId);
	url.searchParams.set('app_key', apiKey);

	const upstream = await fetch(url.toString());
	if (!upstream.ok) {
		return NextResponse.json({ error: 'Upstream API error' }, { status: upstream.status });
	}

	const data = await upstream.json();
	const results = Array.isArray(data.hits) ? data.hits.map((hit) => hit.recipe) : [];

	return NextResponse.json({ results });
}
