'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_RECIPES, SEARCH_RECIPES, GET_RECIPE_BY_ID } from '@/graphql/queries';
import { fetchEdamamRecipes, fetchRecipeById, transformEdamamRecipe } from '@/utils/edamamUtils';

export function useRecipes(options = {}) {
	const { limit = 10, category } = options;
	const [searchQuery, setSearchQuery] = useState('');
	const [edamamRecipes, setEdamamRecipes] = useState([]);
	const [edamamLoading, setEdamamLoading] = useState(false);
	const [nextPageUrl, setNextPageUrl] = useState(null);
	const [apiError, setApiError] = useState(null);
	const [hasApiFailure, setHasApiFailure] = useState(false);

	// Cursor-based pagination state
	const [nextCursor, setNextCursor] = useState(null);
	const [prevCursor, setRevCursor] = useState(null);
	const [hasMore, setHasMore] = useState(false);

	// GraphQL query for database recipes
	const {
		data: dbData,
		loading: dbLoading,
		error: dbError,
		refetch: refetchDbRecipes,
	} = useQuery(GET_RECIPES, {
		variables: { limit, cursor: null, forward: true, category },
		errorPolicy: 'all',
		onCompleted: (data) => {
			if (data?.recipes?.pageInfo) {
				setNextCursor(data.recipes.pageInfo.nextCursor);
				setRevCursor(data.recipes.pageInfo.prevCursor);
				setHasMore(data.recipes.pageInfo.hasMore);
			}
		},
		onError: (error) => {
			console.error('GraphQL Error fetching recipes:', error);
			setApiError(error);
			setHasApiFailure(true);
		},
	});

	// Lazy query for search
	const [searchDbRecipes, { data: searchDbData, loading: searchDbLoading }] = useLazyQuery(
		SEARCH_RECIPES,
		{
			errorPolicy: 'all',
			onCompleted: (data) => {
				if (data?.searchRecipes?.pageInfo) {
					setNextCursor(data.searchRecipes.pageInfo.nextCursor);
					setRevCursor(data.searchRecipes.pageInfo.prevCursor);
					setHasMore(data.searchRecipes.pageInfo.hasMore);
				}
			},
			onError: (error) => {
				console.error('GraphQL Error searching recipes:', error);
				setApiError(error);
				setHasApiFailure(true);
			},
		}
	);

	// Lazy query for individual recipe
	const [getRecipeById] = useLazyQuery(GET_RECIPE_BY_ID, {
		errorPolicy: 'all',
		onError: (error) => {
			console.error('GraphQL Error fetching recipe by ID:', error);
			setApiError(error);
		},
	});

	// Fetch from Edamam API (external recipes)
	const fetchEdamamRecipesData = useCallback(async (query = 'popular recipes', url = null) => {
		try {
			setEdamamLoading(true);
			setApiError(null); // Clear previous errors
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
				setHasApiFailure(false); // Reset failure state on success
			}
		} catch (err) {
			console.error('Error fetching Edamam recipes:', err);
			setApiError(err);
			setHasApiFailure(true);
			// Don't set fallback recipes anymore
		} finally {
			setEdamamLoading(false);
		}
	}, []);

	// Combined recipes from both sources
	const recipes = useMemo(
		() => [
			...(dbData?.recipes?.recipes || []),
			...(searchDbData?.searchRecipes?.recipes || []),
			...edamamRecipes,
		],
		[dbData?.recipes?.recipes, searchDbData?.searchRecipes?.recipes, edamamRecipes]
	);

	const loading = dbLoading || searchDbLoading || edamamLoading;
	const error = dbError || apiError;

	// Check if we have any data at all
	const hasAnyData =
		dbData?.recipes?.length > 0 ||
		searchDbData?.searchRecipes?.length > 0 ||
		edamamRecipes.length > 0;
	const shouldShowApiStatus = hasApiFailure && !hasAnyData;

	const searchRecipes = useCallback(
		(query) => {
			setSearchQuery(query);

			// Reset cursors on new search
			setNextCursor(null);
			setRevCursor(null);

			// Search in database first using cursor-based pagination
			searchDbRecipes({
				variables: {
					query,
					limit: 5,
					cursor: null, // Start from beginning on new search
					forward: true, // Forward pagination by default
				},
			});

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

	// Load more database recipes (next page)
	const loadMoreDbRecipes = useCallback(() => {
		if (nextCursor && hasMore) {
			if (searchQuery) {
				// If we have a search query, use searchRecipes
				searchDbRecipes({
					variables: {
						query: searchQuery,
						limit,
						cursor: nextCursor,
						forward: true,
					},
				});
			} else {
				// Otherwise use regular recipe loading
				refetchDbRecipes({
					limit,
					cursor: nextCursor,
					forward: true,
					category,
				});
			}
		}
	}, [nextCursor, hasMore, searchQuery, searchDbRecipes, refetchDbRecipes, limit, category]);

	// Load previous page of database recipes
	const loadPreviousDbRecipes = useCallback(() => {
		if (prevCursor) {
			if (searchQuery) {
				// If we have a search query, use searchRecipes
				searchDbRecipes({
					variables: {
						query: searchQuery,
						limit,
						cursor: prevCursor,
						forward: false,
					},
				});
			} else {
				// Otherwise use regular recipe loading
				refetchDbRecipes({
					limit,
					cursor: prevCursor,
					forward: false,
					category,
				});
			}
		}
	}, [prevCursor, searchQuery, searchDbRecipes, refetchDbRecipes, limit, category]);

	return {
		recipes,
		loading,
		error,
		hasMore: Boolean(nextPageUrl),
		searchQuery,
		apiError,
		hasApiFailure,
		shouldShowApiStatus,
		getRecipeById: getRecipeByIdFunc,
		searchRecipes,
		loadMoreRecipes,
		refetchDbRecipes,

		// Cursor-based pagination helpers for DB results
		hasNextDbPage: hasMore,
		hasPrevDbPage: !!prevCursor,
		loadMoreDbRecipes,
		loadPreviousDbRecipes,

		retryApiConnection: () => {
			setHasApiFailure(false);
			setApiError(null);
			refetchDbRecipes();
		},
	};
}
