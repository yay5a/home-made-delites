// This file contains server-side only logic for recipe database operations.
// It should only be imported in server-side files (e.g., API routes).

import Recipe from '../models/Recipe';
import dbConnect from './mongoose';

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
 * @param {string} id - Recipe ID
 * @returns {Promise<Object|null>} - Recipe document or null
 */
export async function findRecipeById(id) {
	await dbConnect();
	let recipe = null;
	try {
		recipe = await Recipe.findById(id);
	} catch (error) {
		console.log('Not a valid MongoDB id, trying external id...');
	}
	if (!recipe) {
		recipe = await Recipe.findOne({ externalId: id });
	}
	return recipe;
}

/**
 * Find recipes by search criteria
 * @param {Object} criteria - Search criteria
 * @param {number} page - Page number
 * @param {number} limit - Results per page
 * @returns {Promise<Object>} - Paginated search results
 */
export async function searchRecipes(criteria = {}, page = 1, limit = 10) {
	await dbConnect();

	const query = {};
	if (criteria.query) {
		query.$text = { $search: criteria.query };
	}
	if (criteria.cuisineType) {
		query.cuisineType = {
			$in: Array.isArray(criteria.cuisineType) ? criteria.cuisineType : [criteria.cuisineType],
		};
	}
	// ... other filters ...

	const skip = (page - 1) * limit;
	const recipes = await Recipe.find(query)
		.sort(criteria.query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean();

	const count = await Recipe.countDocuments(query);

	return {
		recipes,
		pagination: {
			page,
			limit,
			totalPages: Math.ceil(count / limit),
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
 * Get recipes created, liked, or saved by a user
 * @param {string} userId - User ID
 * @param {string} type - Type of recipes to fetch (created, liked, saved)
 * @param {number} page - Page number
 * @param {number} limit - Results per page
 * @returns {Promise<Object>} - Paginated recipe results
 */
export async function getUserRecipes(userId, type = 'created', page = 1, limit = 10) {
	await dbConnect();
	const User = (await import('../models/User')).default;

	const user = await User.findById(userId);
	if (!user) {
		throw new Error('User not found');
	}

	const skip = (page - 1) * limit;
	let recipes = [];
	let count = 0;

	switch (type) {
		case 'created':
			recipes = await Recipe.find({ createdBy: userId })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean();
			count = await Recipe.countDocuments({ createdBy: userId });
			break;
		case 'liked':
			recipes = await Recipe.find({ _id: { $in: user.likedRecipes } })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean();
			count = user.likedRecipes.length;
			break;
		case 'saved':
			recipes = await Recipe.find({ _id: { $in: user.savedRecipes } })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean();
			count = user.savedRecipes.length;
			break;
		default:
			throw new Error('Invalid recipe type');
	}

	return {
		recipes,
		pagination: {
			page,
			limit,
			totalPages: Math.ceil(count / limit),
			totalResults: count,
		},
	};
}
