import { NextResponse } from 'next/server';
import { fetchEdamamRecipes, fetchRecipeById } from '@/utils/edamamClient';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	const query = searchParams.get('query');

	if (id) {
		const recipe = await fetchRecipeById(id);
		if (!recipe) {
			return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
		}
		return NextResponse.json(recipe);
	}

	const results = await fetchEdamamRecipes(query || 'popular recipes');
	return NextResponse.json(results);
}
