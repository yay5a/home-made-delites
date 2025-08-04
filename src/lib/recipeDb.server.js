// This file contains server-side only logic for recipe database operations.
// It should only be imported in server-side files (e.g., API routes).

import Recipe from '../models/Recipe';
import dbConnect from './mongoose';
import logger from '@/utils/logger';
import mongoose from 'mongoose';

/**
 * Save a recipe to the database
 * @param {Object} recipeData - Transformed recipe data
 * @returns {Promise<Object>} - Saved recipe document
 */
export async function saveRecipeToDb(recipeData) {
	await dbConnect();

	const existingRecipe = recipeData.externalId
		? await Recipe.findOne({ externalId: recipeData.externalId })
		: null;

	if (existingRecipe) {
		Object.assign(existingRecipe, recipeData);
		await existingRecipe.save();
		return existingRecipe;
	} else {
		const newRecipe = new Recipe({
			...recipeData,
			isEdamamRecipe: true,
		});
		await newRecipe.save();
		return newRecipe;
	}
}

/**
 * Find a recipe by externalId or MongoDB id
 * Efficiently checks if ID is valid MongoDB ObjectId before querying
 * @param {string} id - Recipe ID
 * @returns {Promise<Object|null>} - Recipe document or null
 */
export async function findRecipeById(id) {
	await dbConnect();
	let recipe = null;

	// Check if ID is a valid MongoDB ObjectId
	if (mongoose.Types.ObjectId.isValid(id)) {
		// Only query by _id if it's a valid ObjectId
		recipe = await Recipe.findById(id);
	} else {
		logger.debug('Not a valid MongoDB id, trying external id directly');
	}

	// If not found by ObjectId or not a valid ObjectId, try by externalId
	if (!recipe) {
		recipe = await Recipe.findOne({ externalId: id });
	}

	return recipe;
}

/**
 * Find recipes by search criteria using cursor-based pagination
 * @param {Object} criteria - Search criteria
 * @param {number} limit - Results per page
 * @param {string|null} cursor - Cursor for pagination (typically an ID or timestamp)
 * @param {boolean} forward - Direction of pagination (true for forward, false for backward)
 * @returns {Promise<Object>} - Cursor-paginated search results
 */
export async function searchRecipes(criteria = {}, limit = 10, cursor = null, forward = true) {
	await dbConnect();

	// Build the base query
	const query = {};
	let sort = { createdAt: -1 };
	let projection = {};
	let sortField = 'createdAt';

	if (criteria.query && criteria.useTextSearch) {
		query.$text = { $search: criteria.query };
		sort = { score: { $meta: 'textScore' } };
		projection = { score: { $meta: 'textScore' } };
		sortField = 'score';
	} else if (criteria.query) {
		// fallback: regex search (should be avoided for performance)
		query.$or = [
			{ title: { $regex: criteria.query, $options: 'i' } },
			{ description: { $regex: criteria.query, $options: 'i' } },
			{ ingredients: { $regex: criteria.query, $options: 'i' } },
			{ tags: { $regex: criteria.query, $options: 'i' } },
			{ cuisineType: { $regex: criteria.query, $options: 'i' } },
			{ dishType: { $regex: criteria.query, $options: 'i' } },
		];
		sort = { createdAt: -1 };
		sortField = 'createdAt';
	}
	if (criteria.cuisineType) {
		query.cuisineType = {
			$in: Array.isArray(criteria.cuisineType) ? criteria.cuisineType : [criteria.cuisineType],
		};
	}
	// ... other filters ...

	// Apply cursor-based filtering if cursor is provided
	if (cursor) {
		// Decode the cursor (base64 encoded JSON with id and sort field value)
		let decodedCursor;
		try {
			decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
		} catch (e) {
			logger.error('Invalid cursor format', e);
			throw new Error('Invalid cursor format');
		}

		// Extract values from cursor
		const { id, value } = decodedCursor;

		// Build the comparison query based on sort direction
		if (forward) {
			if (sortField === 'score') {
				// For text search score, we need special handling
				// First prioritize by score, then by _id for tie-breaking
				query.$or = [{ [sortField]: { $lt: value } }, { [sortField]: value, _id: { $gt: id } }];
			} else {
				// For regular fields like createdAt
				query.$or = [{ [sortField]: { $lt: value } }, { [sortField]: value, _id: { $gt: id } }];
			}
		} else {
			// Backward pagination
			if (sortField === 'score') {
				query.$or = [{ [sortField]: { $gt: value } }, { [sortField]: value, _id: { $lt: id } }];
			} else {
				query.$or = [{ [sortField]: { $gt: value } }, { [sortField]: value, _id: { $lt: id } }];
			}
		}
	}

	// Execute the query
	const recipes = await Recipe.find(query, projection)
		.sort(sort)
		.limit(limit + 1) // Request one extra item to check if there are more pages
		.lean();

	// Check if there are more results
	const hasMore = recipes.length > limit;

	// Remove the extra item if we fetched one
	if (hasMore) {
		recipes.pop();
	}

	// Create cursors for next/previous pages
	let nextCursor = null;
	let prevCursor = null;

	if (recipes.length > 0) {
		// Get the last item for the next cursor
		const lastItem = recipes[recipes.length - 1];
		const lastItemSortValue =
			sortField === 'score'
				? lastItem.score || 0 // Score might be undefined
				: lastItem[sortField];

		// Create the next cursor
		if (hasMore) {
			nextCursor = Buffer.from(
				JSON.stringify({
					id: lastItem._id.toString(),
					value: lastItemSortValue,
				})
			).toString('base64');
		}

		// Get the first item for the previous cursor
		const firstItem = recipes[0];
		const firstItemSortValue = sortField === 'score' ? firstItem.score || 0 : firstItem[sortField];

		// Create previous cursor if not at the start
		if (cursor) {
			prevCursor = Buffer.from(
				JSON.stringify({
					id: firstItem._id.toString(),
					value: firstItemSortValue,
				})
			).toString('base64');
		}
	}

	// Get total count for initial page load only
	// For subsequent pages, we don't need this expensive operation
	let count = null;
	if (!cursor) {
		count = await Recipe.countDocuments(query);
	}

	return {
		recipes,
		pagination: {
			hasMore,
			nextCursor,
			prevCursor,
			totalResults: count,
		},
	};
}

/**
 * Save user interaction with a recipe (like, save, etc.)
 * @param {string} userId - User ID
 * @param {string} recipeId - Recipe ID
 * @param {string} interactionType - Type of interaction (like, save, etc.)
 * @returns {Promise<Object>} - Updated user or recipe document
 */
export async function saveRecipeInteraction(userId, recipeId, interactionType) {
	await dbConnect();
	const User = (await import('../models/User')).default;

	const user = await User.findById(userId);
	if (!user) {
		throw new Error('User not found');
	}

	// Ensure the recipe exists
	const recipe = await findRecipeById(recipeId);
	if (!recipe) {
		throw new Error('Recipe not found');
	}

	// Handle different interaction types
	switch (interactionType) {
		case 'like':
			if (!user.likedRecipes.includes(recipeId)) {
				user.likedRecipes.push(recipeId);
			}
			break;
		case 'save':
			if (!user.savedRecipes.includes(recipeId)) {
				user.savedRecipes.push(recipeId);
			}
			break;
		case 'unlike':
			user.likedRecipes = user.likedRecipes.filter((id) => id.toString() !== recipeId.toString());
			break;
		case 'unsave':
			user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId.toString());
			break;
		default:
			throw new Error('Invalid interaction type');
	}

	await user.save();
	return user;
}

/**
 * Get recipes created, liked, or saved by a user with cursor-based pagination
 * @param {string} userId - User ID
 * @param {string} type - Type of recipes to fetch (created, liked, saved)
 * @param {number} limit - Results per page
 * @param {string|null} cursor - Cursor for pagination
 * @param {boolean} forward - Direction of pagination (true for forward, false for backward)
 * @returns {Promise<Object>} - Cursor-paginated recipe results
 */
export async function getUserRecipes(
	userId,
	type = 'created',
	limit = 10,
	cursor = null,
	forward = true
) {
	await dbConnect();
	const User = (await import('../models/User')).default;

	const user = await User.findById(userId);
	if (!user) {
		throw new Error('User not found');
	}

	// Base query and sort
	const sortField = 'createdAt';
	const sortDir = -1;
	const sort = { [sortField]: sortDir };
	let query = {};
	let count = null;

	// Set up base query depending on type
	switch (type) {
		case 'created':
			query = { createdBy: userId };
			break;
		case 'liked':
			query = { _id: { $in: user.likedRecipes } };
			break;
		case 'saved':
			query = { _id: { $in: user.savedRecipes } };
			break;
		default:
			throw new Error('Invalid recipe type');
	}

	// Apply cursor-based filtering if cursor is provided
	if (cursor) {
		// Decode the cursor
		let decodedCursor;
		try {
			decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
		} catch (e) {
			logger.error('Invalid cursor format', e);
			throw new Error('Invalid cursor format');
		}

		// Extract values from cursor
		const { id, value } = decodedCursor;

		// Build the comparison query based on sort direction
		if (forward) {
			query.$or = [
				{ [sortField]: { $lt: new Date(value) } },
				{ [sortField]: new Date(value), _id: { $gt: id } },
			];
		} else {
			query.$or = [
				{ [sortField]: { $gt: new Date(value) } },
				{ [sortField]: new Date(value), _id: { $lt: id } },
			];
		}
	}

	// Execute the query
	// Only fetch minimal fields for list view
	const recipes = await Recipe.find(query, { title: 1, image: 1, createdAt: 1 })
		.sort(sort)
		.limit(limit + 1) // Request one extra item to check if there are more pages
		.lean();

	// Check if there are more results
	const hasMore = recipes.length > limit;

	// Remove the extra item if we fetched one
	if (hasMore) {
		recipes.pop();
	}

	// Create cursors for next/previous pages
	let nextCursor = null;
	let prevCursor = null;

	if (recipes.length > 0) {
		// Get the last item for the next cursor
		const lastItem = recipes[recipes.length - 1];
		const lastItemSortValue = lastItem[sortField].toISOString();

		// Create the next cursor
		if (hasMore) {
			nextCursor = Buffer.from(
				JSON.stringify({
					id: lastItem._id.toString(),
					value: lastItemSortValue,
				})
			).toString('base64');
		}

		// Get the first item for the previous cursor
		const firstItem = recipes[0];
		const firstItemSortValue = firstItem[sortField].toISOString();

		// Create previous cursor if not at the start
		if (cursor) {
			prevCursor = Buffer.from(
				JSON.stringify({
					id: firstItem._id.toString(),
					value: firstItemSortValue,
				})
			).toString('base64');
		}
	}

	// Get total count for initial page load only
	if (!cursor) {
		switch (type) {
			case 'created':
				count = await Recipe.countDocuments({ createdBy: userId });
				break;
			case 'liked':
				count = user.likedRecipes.length;
				break;
			case 'saved':
				count = user.savedRecipes.length;
				break;
		}
	}

	return {
		recipes,
		pagination: {
			hasMore,
			nextCursor,
			prevCursor,
			totalResults: count,
		},
	};
}
