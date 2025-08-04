import { validateResponseStructure, validateRecipe } from './edamamValidator';
import { transformEdamamRecipe } from './recipeTransformer';
import { API_LIMITS as IMPORTED_API_LIMITS } from '@/config/apiLimits';
import logger from '@/utils/logger';

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
		logger.error('Error fetching from Edamam API', error);
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
			logger.error('Unexpected API response format', data);
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
			logger.error('Recipe validation error', validationError);
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
				logger.error('Error saving recipe to database', dbError);
			}

			return transformedRecipe;
		}
	} catch (error) {
		logger.error('Error fetching recipe by ID', error);
		return null;
	}
}

// Enhanced in-memory cache for recipes and search results using Map for better performance
class TTLCache {
	constructor(ttl) {
		this.cache = new Map();
		this.defaultTTL = ttl;

		// Run cleanup every minute to remove expired items
		this.interval = setInterval(() => this.cleanup(), 60000);
	}

	// Stop the cleanup interval
	stop() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}

	// Clean up expired entries
	cleanup() {
		const now = Date.now();
		for (const [key, { expiry }] of this.cache.entries()) {
			if (expiry <= now) {
				this.cache.delete(key);
			}
		}
	}

	// Set a value with optional TTL
	set(key, value, ttl = this.defaultTTL) {
		this.cache.set(key, {
			data: value,
			expiry: Date.now() + ttl,
		});
	}

	// Get a value (returns null if expired or not found)
	get(key) {
		const entry = this.cache.get(key);
		const now = Date.now();

		if (!entry) return null;

		// Auto-delete if expired
		if (entry.expiry <= now) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	// Check if cache has a non-expired key
	has(key) {
		const entry = this.cache.get(key);
		if (!entry) return false;

		if (entry.expiry <= Date.now()) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}

	// Clear the entire cache
	clear() {
		this.cache.clear();
	}
}

// Create separate caches with different TTLs
const cache = {
	searches: new TTLCache(15 * 60 * 1000), // 15 minutes for search results
	recipes: new TTLCache(60 * 60 * 1000), // 1 hour for individual recipes

	getCacheKey: (query, options = {}) => {
		// Create a unique key based on the query and options
		const optionsStr = options ? JSON.stringify(options) : '';
		return `${query}${optionsStr}`;
	},

	cacheSearch: (query, options = {}, data, ttl) => {
		const key = cache.getCacheKey(query, options);
		cache.searches.set(key, data, ttl);

		// Also cache individual recipes from search results
		if (data && data.hits && Array.isArray(data.hits)) {
			data.hits.forEach((hit) => {
				if (hit.recipe && hit.recipe.uri) {
					const idMatch = hit.recipe.uri.match(/recipe_([a-zA-Z0-9]+)/);
					if (idMatch) {
						const recipeId = idMatch[1];
						cache.recipes.set(recipeId, hit.recipe);
					}
				}
			});
		}
	},

	getSearch: (query, options = {}) => {
		const key = cache.getCacheKey(query, options);
		return cache.searches.get(key);
	},

	cacheRecipe: (id, data, ttl) => {
		cache.recipes.set(id, data, ttl);
	},

	getRecipe: (id) => {
		return cache.recipes.get(id);
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

// Clean up resources when module is unloaded (useful for hot module reloading)
if (typeof window !== 'undefined') {
	window.addEventListener('beforeunload', () => {
		if (cache.searches && cache.searches.stop) cache.searches.stop();
		if (cache.recipes && cache.recipes.stop) cache.recipes.stop();
	});
}

// Handle Node.js module unloading
if (typeof process !== 'undefined' && typeof process.on === 'function') {
	process.on('SIGTERM', () => {
		if (cache.searches && cache.searches.stop) cache.searches.stop();
		if (cache.recipes && cache.recipes.stop) cache.recipes.stop();
	});
}
