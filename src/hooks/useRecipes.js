'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_RECIPES, SEARCH_RECIPES, GET_RECIPE_BY_ID } from '@/graphql/queries';
import { fetchEdamamRecipes, fetchRecipeById, transformEdamamRecipe } from '@/utils/edamamUtils';

// Fallback recipes in case API fails
const fallbackRecipes = [
	{
		id: 'fallback-1',
		title: 'Classic Chocolate Chip Cookies',
		description: 'Soft and chewy chocolate chip cookies that are perfect for any occasion.',
		image: '/images/chocolate-chip-cookies.jpg',
		prepTime: 15,
		cookTime: 12,
		servings: 24,
		category: 'dessert',
		difficulty: 'easy',
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
		author: {
			id: 'fallback-author',
			name: 'Recipe Master',
			email: 'recipes@homemadedelites.com',
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

export function useRecipes(options = {}) {
	const { limit = 10, offset = 0, category } = options;
	const [searchQuery, setSearchQuery] = useState('');
	const [edamamRecipes, setEdamamRecipes] = useState([]);
	const [edamamLoading, setEdamamLoading] = useState(false);
	const [nextPageUrl, setNextPageUrl] = useState(null);

	// GraphQL query for database recipes
	const {
		data: dbData,
		loading: dbLoading,
		error: dbError,
		refetch: refetchDbRecipes,
	} = useQuery(GET_RECIPES, {
		variables: { limit, offset, category },
		errorPolicy: 'all',
		onError: (error) => {
			console.error('GraphQL Error fetching recipes:', error);
		},
	});

	// Lazy query for search
	const [searchDbRecipes, { data: searchDbData, loading: searchDbLoading }] = useLazyQuery(
		SEARCH_RECIPES,
		{
			errorPolicy: 'all',
			onError: (error) => {
				console.error('GraphQL Error searching recipes:', error);
			},
		}
	);

	// Lazy query for individual recipe
	const [getRecipeById] = useLazyQuery(GET_RECIPE_BY_ID, {
		errorPolicy: 'all',
		onError: (error) => {
			console.error('GraphQL Error fetching recipe by ID:', error);
		},
	});

	// Fetch from Edamam API (external recipes)
	const fetchEdamamRecipesData = useCallback(
		async (query = 'popular recipes', url = null) => {
			try {
				setEdamamLoading(true);
				let data;

				if (url) {
					const response = await fetch(url);
					if (!response.ok) throw new Error(`API error: ${response.status}`);
					data = await response.json();
				} else {
					data = await fetchEdamamRecipes(query);
				}

				if (data && data.hits) {
					const transformedRecipes = data.hits
						.map((hit) => transformEdamamRecipe(hit))
						.filter((recipe) => recipe !== null);

					setEdamamRecipes((prevRecipes) =>
						url ? [...prevRecipes, ...transformedRecipes] : transformedRecipes
					);
					setNextPageUrl(data._links?.next?.href || null);
				}
			} catch (err) {
				console.error('Error fetching Edamam recipes:', err);
				if (edamamRecipes.length === 0) {
					setEdamamRecipes(fallbackRecipes);
				}
			} finally {
				setEdamamLoading(false);
			}
		},
		[edamamRecipes.length]
	);

	// Combined recipes from both sources
	const recipes = useMemo(
		() => [...(dbData?.recipes || []), ...(searchDbData?.searchRecipes || []), ...edamamRecipes],
		[dbData?.recipes, searchDbData?.searchRecipes, edamamRecipes]
	);

	const loading = dbLoading || searchDbLoading || edamamLoading;
	const error = dbError;

	const searchRecipes = useCallback(
		(query) => {
			setSearchQuery(query);

			// Search in database first
			searchDbRecipes({ variables: { query, limit: 5, offset: 0 } });

			// Then search external API
			fetchEdamamRecipesData(query);
		},
		[searchDbRecipes, fetchEdamamRecipesData]
	);

	const loadMoreRecipes = useCallback(() => {
		if (nextPageUrl) {
			fetchEdamamRecipesData(searchQuery, nextPageUrl);
		}
	}, [nextPageUrl, searchQuery, fetchEdamamRecipesData]);

	const getRecipeByIdFunc = useCallback(
		async (id) => {
			// First check if we already have the recipe in our state
			const existingRecipe = recipes.find((recipe) => recipe.id === id);
			if (existingRecipe) {
				return existingRecipe;
			}

			// Try GraphQL first
			try {
				const result = await getRecipeById({ variables: { id } });
				if (result.data?.recipe) {
					return result.data.recipe;
				}
			} catch (err) {
				console.error('Error fetching recipe from GraphQL:', err);
			}

			// Fallback to Edamam API
			try {
				const { fetchRecipeById } = require('@/utils/edamamUtils');
				return await fetchRecipeById(id);
			} catch (err) {
				console.error('Error fetching recipe by ID:', err);
				return null;
			}
		},
		[recipes, getRecipeById]
	);

	return {
		recipes: recipes.length > 0 ? recipes : fallbackRecipes,
		loading,
		error,
		hasMore: Boolean(nextPageUrl),
		searchQuery,
		getRecipeById: getRecipeByIdFunc,
		searchRecipes,
		loadMoreRecipes,
		refetchDbRecipes,
	};
}
