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

	// Process nutritional information
	const nutrients = {};
	if (recipe.totalNutrients) {
		Object.entries(recipe.totalNutrients).forEach(([key, nutrient]) => {
			if (
				nutrient &&
				typeof nutrient === 'object' &&
				'label' in nutrient &&
				'quantity' in nutrient &&
				'unit' in nutrient
			) {
				nutrients[key] = {
					label: nutrient.label,
					quantity: parseFloat(nutrient.quantity.toFixed(1)),
					unit: nutrient.unit,
				};
			}
		});
	}

	return {
		id,
		title: recipe.label,
		description: recipe.cuisineType?.join(', ') || recipe.dishType?.join(', ') || 'Delicious recipe',
		image: recipe.image,
		images: recipe.images || {},
		prepTime: recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A',
		cookTime: recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A',
		servings: recipe.yield || 'N/A',
		ingredients: recipe.ingredientLines || [],
		ingredientsDetailed: recipe.ingredients || [],
		instructions: recipe.instructions || ['Visit the source website for detailed instructions'],
		source: recipe.source,
		sourceUrl: recipe.url,
		shareUrl: recipe.shareAs,
		calories: Math.round(recipe.calories) || 0,
		dietLabels: recipe.dietLabels || [],
		healthLabels: recipe.healthLabels || [],
		cautions: recipe.cautions || [],
		cuisineType: recipe.cuisineType || [],
		mealType: recipe.mealType || [],
		dishType: recipe.dishType || [],
		totalWeight: recipe.totalWeight || 0,
		nutrients: nutrients,
		totalDaily: recipe.totalDaily || {},
		digest: recipe.digest || [],
		// Additional fields from schema
		glycemicIndex: recipe.glycemicIndex || null,
		inflammatoryIndex: recipe.inflammatoryIndex || null,
		totalCO2Emissions: recipe.totalCO2Emissions || null,
		co2EmissionsClass: recipe.co2EmissionsClass || null,
		tags: recipe.tags || [],
		externalId: recipe.externalId || null,
	};
}
