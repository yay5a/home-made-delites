'use client';

import { useState, useCallback } from 'react';
import { fetchEdamamRecipes, fetchRecipeById } from '@/utils/edamamClient';
import { transformEdamamRecipe } from '@/utils/recipeTransformer';

export function useRecipes() {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchRecipes = useCallback(async (query = 'popular recipes') => {
		setLoading(true);
		const data = await fetchEdamamRecipes(query);
		if (data && data.hits) {
			setRecipes(data.hits.map(transformEdamamRecipe).filter(Boolean));
		}
		setLoading(false);
	}, []);

	const getRecipeById = useCallback(async (id) => {
		return await fetchRecipeById(id);
	}, []);

	return {
		recipes,
		loading,
		fetchRecipes,
		getRecipeById,
	};
}
