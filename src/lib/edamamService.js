export default async function fetchRecipes(query) {
	const isServer = typeof window === 'undefined';
	const base = isServer ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' : '';

	const url = `${base}/api/edamam?search=${encodeURIComponent(query)}`;
	const res = await fetch(url);
	if (res.status === 429) {
		const err = new Error('Rate limit exceeded — please wait a moment.');
		err.code = 429;
		throw err;
	}
	if (!res.ok) {
		throw new Error(`Search request failed: ${res.status} ${res.statusText}`);
	}
	const { results } = await res.json();
	return results;
}
