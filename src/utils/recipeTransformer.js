/**
 * Transform Edamam recipe format to our app's format based on our schema
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
		ingredients: recipe.ingredientLines || [],
		instructions: recipe.instructions || ['Visit the source website for detailed instructions'],
		source: recipe.source,
		sourceUrl: recipe.url,
		calories: Math.round(recipe.calories) || 0,
		dietLabels: recipe.dietLabels || [],
		healthLabels: recipe.healthLabels || [],
		cautions: recipe.cautions || [],
	};
}
