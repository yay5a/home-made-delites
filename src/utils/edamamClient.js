import { validateResponseStructure, validateRecipe } from './edamamValidator';
import { transformEdamamRecipe } from './recipeTransformer';
import { API_LIMITS as IMPORTED_API_LIMITS } from '@/config/apiLimits';

// Base URL for Edamam API
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// Re-export API limits for consistency
export const API_LIMITS = IMPORTED_API_LIMITS;

// Stub for client-side; server-side endpoint handles actual tracking
export async function trackApiUsage(type = 'hit', tokens = 0) {
	// No-op in client environment
	return true;
}

/**
 * Fetch recipes from Edamam API following our schema structure
 * @param {string} query - Search query
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Validated API response
 */
export async function fetchEdamamRecipes(query, options = {}) {
	try {
		// Track API usage
		await trackApiUsage('hit');

		// Build URL
		const params = new URLSearchParams({
			type: 'public',
			q: query,
			app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
			app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
			...options,
		});

		const url = `${EDAMAM_BASE_URL}?${params.toString()}`;

		// Fetch from Edamam API
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Edamam API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Validate response structure
		validateResponseStructure(data);

		return data;
	} catch (error) {
		console.error('Error fetching from Edamam API:', error);
		throw error;
	}
}

/**
 * Fetch a single recipe by ID from the Edamam API or MongoDB
 * @param {string} id - Recipe ID
 * @param {boolean} bypassCache - Whether to bypass cache and force a fresh API call
 * @returns {Promise<Object|null>} - Transformed recipe or null if not found
 */
export async function fetchRecipeById(id, bypassCache = false) {
	try {
		// Import here to avoid circular dependencies
		const { findRecipeById, saveRecipeToDb } = await import('../lib/recipeDb.server');

		// Check MongoDB first unless bypassing cache
		if (!bypassCache) {
			const dbRecipe = await findRecipeById(id);
			if (dbRecipe) {
				console.log('Using MongoDB cached recipe:', id);
				return dbRecipe;
			}

			// Fallback to in-memory cache if not in MongoDB
			const cachedRecipe = cache.getRecipe(id);
			if (cachedRecipe) {
				return transformEdamamRecipe({ recipe: cachedRecipe });
			}
		}

		const appId = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
		const appKey = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;

		if (!appId || !appKey) {
			throw new Error('Edamam API credentials not found');
		}

		// Check rate limits before making the API call
		await trackApiUsage('hit');

		// Build query parameters
		const params = new URLSearchParams({
			type: 'public',
			app_id: appId,
			app_key: appKey,
		});

		// Add a timestamp to prevent browser caching
		const url = `${EDAMAM_BASE_URL}/${id}?${params.toString()}&_ts=${Date.now()}`;
		const response = await fetch(url);

		if (!response.ok) {
			if (response.status === 404) {
				return null; // Recipe not found
			}
			if (response.status === 429) {
				throw new Error('Rate limit exceeded by Edamam API');
			}
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();

		// Check if response matches our expected structure
		if (!data || !data.recipe) {
			console.error('Unexpected API response format:', data);
			return null;
		}

		// Cache the recipe in memory for quick access
		cache.cacheRecipe(id, data.recipe);

		// Schema validation for individual recipe
		try {
			validateRecipe(data.recipe);
			const transformedRecipe = transformEdamamRecipe({ recipe: data.recipe });

			// Set externalId for database reference
			const idMatch = data.recipe.uri.match(/recipe_([a-zA-Z0-9]+)/);
			if (idMatch) {
				transformedRecipe.externalId = idMatch[1];
			}

			// Save to MongoDB for persistent caching
			await saveRecipeToDb(transformedRecipe);

			return transformedRecipe;
		} catch (validationError) {
			console.error('Recipe validation error:', validationError);
			// Still return transformed data, but log the error
			const transformedRecipe = transformEdamamRecipe({ recipe: data.recipe });

			// Save to MongoDB even with validation issues
			try {
				const idMatch = data.recipe.uri.match(/recipe_([a-zA-Z0-9]+)/);
				if (idMatch) {
					transformedRecipe.externalId = idMatch[1];
				}
				await saveRecipeToDb(transformedRecipe);
			} catch (dbError) {
				console.error('Error saving recipe to database:', dbError);
			}

			return transformedRecipe;
		}
	} catch (error) {
		console.error('Error fetching recipe by ID:', error);
		return null;
	}
}

// In-memory cache for recipes and search results
const cache = {
	searches: {}, // Store search results
	recipes: {}, // Store individual recipes
	getCacheKey: (query, options = {}) => {
		// Create a unique key based on the query and options
		const optionsStr = options ? JSON.stringify(options) : '';
		return `${query}${optionsStr}`;
	},
	cacheSearch: (query, options = {}, data, ttl = 15 * 60 * 1000) => {
		// Cache search results for 15 minutes (adjustable)
		const key = cache.getCacheKey(query, options);
		cache.searches[key] = {
			data,
			expiry: Date.now() + ttl,
		};

		// Also cache individual recipes from search results
		if (data && data.hits && Array.isArray(data.hits)) {
			data.hits.forEach((hit) => {
				if (hit.recipe && hit.recipe.uri) {
					const idMatch = hit.recipe.uri.match(/recipe_([a-zA-Z0-9]+)/);
					if (idMatch) {
						const recipeId = idMatch[1];
						cache.recipes[recipeId] = {
							data: hit.recipe,
							expiry: Date.now() + ttl,
						};
					}
				}
			});
		}
	},
	getSearch: (query, options = {}) => {
		const key = cache.getCacheKey(query, options);
		const cached = cache.searches[key];

		if (cached && cached.expiry > Date.now()) {
			console.log('Using cached search results for:', query);
			return cached.data;
		}

		return null;
	},
	cacheRecipe: (id, data, ttl = 60 * 60 * 1000) => {
		// Cache individual recipes for 1 hour (adjustable)
		cache.recipes[id] = {
			data,
			expiry: Date.now() + ttl,
		};
	},
	getRecipe: (id) => {
		const cached = cache.recipes[id];

		if (cached && cached.expiry > Date.now()) {
			console.log('Using cached recipe:', id);
			return cached.data;
		}

		return null;
	},
};

/**
 * Stub client-side: returns placeholder API usage statistics
 * @returns {Object} - Placeholder API usage statistics
 */
export async function getApiUsageStats() {
	return {
		minuteHits: { current: 0, limit: API_LIMITS.HITS_PER_MINUTE, resetsIn: 60 },
		monthHits: { current: 0, limit: API_LIMITS.HITS_PER_MONTH, percentUsed: 0 },
		assistantCalls: { current: 0, limit: API_LIMITS.ASSISTANT_CALLS_PER_DAY, percentUsed: 0 },
		assistantTokens: { current: 0, limit: API_LIMITS.ASSISTANT_TOKENS_PER_DAY, percentUsed: 0 },
	};
}
