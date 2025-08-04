// API route for recipe assistant
import { NextResponse } from 'next/server';

// This would be replaced with actual OpenAI or other AI service integration
const MOCK_RESPONSES = [
	'That recipe sounds delicious! I suggest adding some fresh herbs like basil or thyme to enhance the flavor.',
	'For that ingredient substitution, you could use Greek yogurt instead of sour cream for a healthier option with similar texture.',
	'The best way to cook that is to start with a very hot pan, then reduce to medium heat once you add the ingredients.',
	'That dish typically takes about 30-45 minutes to prepare, including prep time and cooking.',
	'For food safety, make sure that meat reaches an internal temperature of 165°F (74°C) before serving.',
];

/**
 * Handles chat requests to the recipe assistant
 * Implements rate limiting via middleware
 */
export async function POST(request) {
	try {
		// Parse request body
		const body = await request.json();
		const { prompt, messages } = body;

		if (!prompt) {
			return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
		}

		// Note: Rate limiting handled by middleware
		// In a production app, we would call the actual AI service here

		// For demo purposes, randomly select a mock response
		const responseIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
		const mockResponse = MOCK_RESPONSES[responseIndex];

		// Add some context from the user prompt to make the response seem more relevant
		let contextualizedResponse = mockResponse;

		// If the prompt contains certain keywords, customize the response
		if (
			prompt.toLowerCase().includes('substitute') ||
			prompt.toLowerCase().includes('replacement')
		) {
			contextualizedResponse =
				'For a substitution in your recipe, you could try using: ' + mockResponse;
		} else if (prompt.toLowerCase().includes('how long') || prompt.toLowerCase().includes('time')) {
			contextualizedResponse = 'Regarding your timing question: ' + mockResponse;
		} else if (
			prompt.toLowerCase().includes('temperature') ||
			prompt.toLowerCase().includes('cook')
		) {
			contextualizedResponse = 'For cooking instructions: ' + mockResponse;
		}

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return NextResponse.json({
			reply: contextualizedResponse,
			promptTokens: prompt.length / 4, // Rough estimation
			completionTokens: contextualizedResponse.length / 4, // Rough estimation
		});
	} catch (error) {
		console.error('Recipe assistant error:', error);
		return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
	}
}
