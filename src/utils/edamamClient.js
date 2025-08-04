const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

export async function fetchEdamamRecipes(query) {
	const params = new URLSearchParams({
		type: 'public',
		q: query,
		app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
		app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
	});
	const url = `${EDAMAM_BASE_URL}?${params.toString()}`;
	const response = await fetch(url);
	if (!response.ok) return null;
	const data = await response.json();
	return data;
}

export async function fetchRecipeById(id) {
	const appId = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
	const appKey = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
	if (!appId || !appKey) return null;
	const params = new URLSearchParams({
		type: 'public',
		app_id: appId,
		app_key: appKey,
	});
	const url = `${EDAMAM_BASE_URL}/${id}?${params.toString()}`;
	const response = await fetch(url);
	if (!response.ok) return null;
	const data = await response.json();
	if (!data || !data.recipe) return null;
	return transformEdamamRecipe({ recipe: data.recipe });
}
