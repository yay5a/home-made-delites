// Utility functions for interacting with the Edamam API
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

/**
 * Fetch recipes from Edamam API
 * @param {string} query - Search query
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - API response
 */
export async function fetchEdamamRecipes(query, options = {}) {
	try {
		const appId = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
		const appKey = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;

		if (!appId || !appKey) {
			throw new Error('Edamam API credentials not found');
		}

		// Build query parameters
		const params = new URLSearchParams({
			type: 'public',
			q: query || '',
			app_id: appId,
			app_key: appKey,
			...options,
		});

		const response = await fetch(`${EDAMAM_BASE_URL}?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching recipes:', error);
		throw error;
	}
}

/**
 * Transform Edamam recipe format to our app's format
 * @param {Object} edamamRecipe - Recipe from Edamam API
 * @returns {Object} - Transformed recipe
 */
export function transformEdamamRecipe(edamamRecipe) {
	const recipe = edamamRecipe.recipe;

	if (!recipe) return null;

	// Extract the recipe ID from the URI
	const idMatch = recipe.uri.match(/recipe_([a-zA-Z0-9]+)/);
	const id = idMatch ? idMatch[1] : Math.random().toString(36).substring(2, 15);

	return {
		id,
		title: recipe.label,
		description: recipe.cuisineType?.join(', ') || recipe.dishType?.join(', ') || 'Delicious recipe',
		image: recipe.image,
		prepTime: recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A',
		cookTime: recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A',
		servings: recipe.yield || 'N/A',
		ingredients: recipe.ingredientLines || [],
		instructions: ['Visit the source website for detailed instructions'],
		source: recipe.source,
		sourceUrl: recipe.url,
		calories: Math.round(recipe.calories) || 0,
		dietLabels: recipe.dietLabels || [],
		healthLabels: recipe.healthLabels || [],
		cautions: recipe.cautions || [],
		nutrients: recipe.totalNutrients || {},
	};
}

/**
 * Fetch a single recipe by ID from the Edamam API
 * @param {string} id - Recipe ID
 * @returns {Promise<Object|null>} - Transformed recipe or null if not found
 */
export async function fetchRecipeById(id) {
	try {
		const appId = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
		const appKey = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;

		if (!appId || !appKey) {
			throw new Error('Edamam API credentials not found');
		}

		// Build query parameters
		const params = new URLSearchParams({
			type: 'public',
			app_id: appId,
			app_key: appKey,
		});

		const response = await fetch(`${EDAMAM_BASE_URL}/${id}?${params.toString()}`);

		if (!response.ok) {
			if (response.status === 404) {
				return null; // Recipe not found
			}
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();

		if (data && data.recipe) {
			return transformEdamamRecipe({ recipe: data.recipe });
		}

		return null;
	} catch (error) {
		console.error('Error fetching recipe by ID:', error);
		return null;
	}
}
