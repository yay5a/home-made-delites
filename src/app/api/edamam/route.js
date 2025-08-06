import { NextResponse } from 'next/server';

export async function GET(request) {
	const { search } = Object.fromEntries(request.nextUrl.searchParams);
	// Simple validation
	if (typeof search !== 'string' || !search.trim()) {
		return NextResponse.json({ results: [] });
	}

	// Server-side fetch with hidden env vars
	const res = await fetch(
		`https://api.edamam.com/search?q=${encodeURIComponent(search)}` +
			`&app_id=${process.env.APP_ID}` +
			`&app_key=${process.env.API_KEY}`
	);
	if (!res.ok) throw new Error('Edamam API error');

	const json = await res.json();
	const results = json.hits.map((hit) => hit.recipe);
	return NextResponse.json({ results });
}
