/**
 * Validates the API response against our expected schema
 * @param {Object} response - The API response to validate
 * @throws {Error} - If validation fails
 */
export function validateResponseStructure(response) {
	// Check required top-level properties
	const requiredProps = ['from', 'to', 'count', 'hits'];
	for (const prop of requiredProps) {
		if (!(prop in response)) {
			throw new Error(`Missing required property: ${prop}`);
		}
	}

	// Validate hits array
	if (!Array.isArray(response.hits)) {
		throw new Error('Response hits must be an array');
	}

	// Validate each hit's recipe
	response.hits.forEach((hit, index) => {
		if (!hit.recipe) {
			throw new Error(`Hit at index ${index} is missing recipe property`);
		}

		const recipe = hit.recipe;
		// Check required recipe properties
		const requiredRecipeProps = ['uri', 'label', 'ingredients', 'calories'];
		for (const prop of requiredRecipeProps) {
			if (!(prop in recipe)) {
				throw new Error(`Recipe at index ${index} is missing required property: ${prop}`);
			}
		}
	});
}

/**
 * Validates a single recipe against our schema
 * @param {Object} recipe - The recipe object to validate
 * @throws {Error} - If validation fails
 */
export function validateRecipe(recipe) {
	const requiredProps = ['uri', 'label', 'ingredients', 'calories'];
	for (const prop of requiredProps) {
		if (!(prop in recipe)) {
			throw new Error(`Recipe is missing required property: ${prop}`);
		}
	}

	// Validate ingredients
	if (!Array.isArray(recipe.ingredients)) {
		throw new Error('Recipe ingredients must be an array');
	}

	// Validate calories
	if (typeof recipe.calories !== 'number') {
		throw new Error('Recipe calories must be a number');
	}

	// Additional validations could be added here
}
