// API route for user recipe interactions (likes, saves)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { saveRecipeInteraction, getUserRecipes } from '@/lib/recipeFetcher.server';
import { verifyToken } from '@/lib/authService';

export async function GET(request) {
	try {
		// Get authentication token
		const authHeader = request.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
		}

		// Verify token
		const token = authHeader.split(' ')[1];
		const decoded = verifyToken(token);
		const userId = decoded.id;

		// Get user's recipes
		const userRecipes = await getUserRecipes(userId);

		return NextResponse.json(userRecipes);
	} catch (error) {
		console.error('Error fetching user recipes:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		await dbConnect();

		// Get authentication token
		const authHeader = request.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
		}

		// Verify token
		const token = authHeader.split(' ')[1];
		const decoded = verifyToken(token);
		const userId = decoded.id;

		// Parse request body
		const body = await request.json();
		const { recipeId, interactionType } = body;

		if (!recipeId || !interactionType) {
			return NextResponse.json(
				{ error: 'Recipe ID and interaction type are required' },
				{ status: 400 }
			);
		}

		// Validate interaction type
		if (!['like', 'save'].includes(interactionType)) {
			return NextResponse.json(
				{ error: 'Interaction type must be "like" or "save"' },
				{ status: 400 }
			);
		}

		// Process the interaction
		const updatedRecipe = await saveRecipeInteraction(recipeId, userId, interactionType);

		return NextResponse.json({
			success: true,
			recipe: updatedRecipe,
		});
	} catch (error) {
		console.error('Error processing recipe interaction:', error);
		return NextResponse.json({ error: 'Failed to process recipe interaction' }, { status: 400 });
	}
}
