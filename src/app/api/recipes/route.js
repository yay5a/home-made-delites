// API route for recipes
import { NextResponse } from 'next/server';
import logger from '@/utils/logger';
import { searchRecipes, findRecipeById } from '@/lib/recipeDb.server';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');
		const query = searchParams.get('query');
		const page = parseInt(searchParams.get('page') || '1', 10);
		const limit = parseInt(searchParams.get('limit') || '10', 10);
		const cuisineType = searchParams.get('cuisineType');
		const mealType = searchParams.get('mealType');
		const dishType = searchParams.get('dishType');

		// If ID is provided, fetch a single recipe
		if (id) {
			// Try DB first, then Edamam API with caching
			const recipe = await findRecipeById(id);
			if (!recipe) {
				return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
			}
			return NextResponse.json(recipe);
		}

		// Build criteria for recipe search
		const criteria = {};
		if (query) criteria.query = query;
		if (cuisineType) criteria.cuisineType = cuisineType;
		if (mealType) criteria.mealType = mealType;
		if (dishType) criteria.dishType = dishType;

		const results = await searchRecipes(criteria, page, limit);
		return NextResponse.json(results);
	} catch (error) {
		logger.error('Error in recipe API route:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		await dbConnect();

		// Parse JSON body
		const body = await request.json();

		// Create new recipe
		const recipe = new Recipe(body);
		await recipe.save();

		return NextResponse.json(recipe, { status: 201 });
	} catch (error) {
		logger.error('Error creating recipe:', error);
		return NextResponse.json({ error: 'Failed to create recipe' }, { status: 400 });
	}
}
