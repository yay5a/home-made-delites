export default async function fetchRecipes(query) {
	const url = `/api/recipes?search=${encodeURIComponent(query)}`;
	const res = await fetch(url);

	// Rate-limit exceeded
	if (res.status === 429) {
		const err = new Error('Rate limit exceeded — please wait a moment.');
		err.code = 429;
		throw err;
	}

	// Other fetch errors
	if (!res.ok) {
		throw new Error(`Search request failed: ${res.status} ${res.statusText}`);
	}

	const json = await res.json();
	return json.results;
}
