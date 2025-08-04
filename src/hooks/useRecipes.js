'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchEdamamRecipes, transformEdamamRecipe } from '@/utils/edamamUtils';

// Fallback recipes in case API fails
const fallbackRecipes = [
	{
		id: 'fallback-1',
		title: 'Classic Chocolate Chip Cookies',
		description: 'Soft and chewy chocolate chip cookies that are perfect for any occasion.',
		image: '/images/chocolate-chip-cookies.jpg',
		prepTime: '15 minutes',
		cookTime: '12 minutes',
		servings: 24,
		ingredients: [
			'2 1/4 cups all-purpose flour',
			'1 tsp baking soda',
			'1 tsp salt',
			'1 cup butter, softened',
			'3/4 cup granulated sugar',
			'3/4 cup packed brown sugar',
			'2 large eggs',
			'2 tsp vanilla extract',
			'2 cups chocolate chips',
		],
		instructions: [
			'Preheat oven to 375°F (190°C).',
			'Mix flour, baking soda, and salt in a bowl.',
			'In another bowl, beat butter and sugars until creamy.',
			'Beat in eggs and vanilla.',
			'Gradually blend in flour mixture.',
			'Stir in chocolate chips.',
			'Drop rounded tablespoons onto ungreased cookie sheets.',
			'Bake 9 to 11 minutes or until golden brown.',
			'Cool on baking sheets 2 minutes; remove to wire rack.',
		],
	},
];

export function useRecipes() {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [totalResults, setTotalResults] = useState(0);
	const [nextPageUrl, setNextPageUrl] = useState(null);

	const fetchRecipes = useCallback(
		async (query = 'popular recipes', url = null) => {
			try {
				setLoading(true);

				let data;

				if (url) {
					// Fetch from next page URL if provided
					const response = await fetch(url);
					if (!response.ok) throw new Error(`API error: ${response.status}`);
					data = await response.json();
				} else {
					// Fetch with new query
					data = await fetchEdamamRecipes(query);
				}

				if (data && data.hits) {
					const transformedRecipes = data.hits
						.map((hit) => transformEdamamRecipe(hit))
						.filter((recipe) => recipe !== null);

					setRecipes((prevRecipes) =>
						url ? [...prevRecipes, ...transformedRecipes] : transformedRecipes
					);
					setTotalResults(data.count || 0);
					setNextPageUrl(data._links?.next?.href || null);
				} else {
					throw new Error('Invalid API response format');
				}
			} catch (err) {
				console.error('Error fetching recipes:', err);
				setError(err);

				// Use fallback recipes if API fails
				if (recipes.length === 0) {
					setRecipes(fallbackRecipes);
				}
			} finally {
				setLoading(false);
			}
		},
		[recipes.length]
	);

	useEffect(() => {
		// Initial fetch
		fetchRecipes();
	}, [fetchRecipes]);

	const searchRecipesFromAPI = useCallback(
		(query) => {
			setSearchQuery(query);
			fetchRecipes(query);
		},
		[fetchRecipes]
	);

	const loadMoreRecipes = useCallback(() => {
		if (nextPageUrl) {
			fetchRecipes(searchQuery, nextPageUrl);
		}
	}, [nextPageUrl, searchQuery, fetchRecipes]);

	const getRecipeById = useCallback(
		async (id) => {
			// First check if we already have the recipe in our state
			const existingRecipe = recipes.find((recipe) => recipe.id === id);

			if (existingRecipe) {
				return existingRecipe;
			}

			// If not found in state, try to fetch it from API
			try {
				const { fetchRecipeById } = require('@/utils/edamamUtils');
				return await fetchRecipeById(id);
			} catch (err) {
				console.error('Error fetching recipe by ID:', err);
				return null;
			}
		},
		[recipes]
	);

	return {
		recipes,
		loading,
		error,
		totalResults,
		hasMore: Boolean(nextPageUrl),
		searchQuery,
		getRecipeById,
		searchRecipes: searchRecipesFromAPI,
		loadMoreRecipes,
	};
}
