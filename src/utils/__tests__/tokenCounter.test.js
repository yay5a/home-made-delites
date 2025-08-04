/**
 * Tests for the tokenCounter utility
 */

import tokenCounter from '../tokenCounter';

describe('Token Counter', () => {
	// Test basic token counting
	test('counts tokens accurately for simple text', () => {
		const text = 'This is a simple English sentence.';
		// Should be around 7-8 tokens
		expect(tokenCounter.countTokens(text)).toBeGreaterThan(6);
		expect(tokenCounter.countTokens(text)).toBeLessThan(10);
	});

	test('returns 0 for empty text', () => {
		expect(tokenCounter.countTokens('')).toBe(0);
		expect(tokenCounter.countTokens(null)).toBe(0);
		expect(tokenCounter.countTokens(undefined)).toBe(0);
	});

	test('handles long words appropriately', () => {
		// Long words should count as multiple tokens
		const text = 'Supercalifragilisticexpialidocious is a very long word.';
		// The long word alone should be multiple tokens
		expect(tokenCounter.countTokens(text)).toBeGreaterThan(10);
	});

	test('counts special characters and numbers properly', () => {
		const text = 'Special characters like @#$%^&* and numbers 123456789 use more tokens.';
		// Should use more tokens than a plain text of similar length
		const plainText = 'Regular words of similar length should use fewer tokens in comparison.';

		expect(tokenCounter.countTokens(text)).toBeGreaterThan(tokenCounter.countTokens(plainText));
	});

	test('estimates JSON strings with proper token counting', () => {
		const jsonObject = {
			name: 'Recipe Token Test',
			ingredients: ['flour', 'sugar', 'eggs', 'milk'],
			steps: ['Mix dry ingredients', 'Add wet ingredients', 'Bake at 350 degrees'],
			nutrition: {
				calories: 240,
				protein: '5g',
				fat: '10g',
			},
		};

		const jsonString = JSON.stringify(jsonObject);
		// JSON will have more tokens due to quotes, braces, etc.
		expect(tokenCounter.countTokens(jsonString)).toBeGreaterThan(30);
	});

	test('handles Unicode characters appropriately', () => {
		// Unicode characters often use more tokens
		const unicodeText = 'Emoji like 😊 and 🍕 or characters like 你好 use more tokens.';
		const asciiText = 'Plain ASCII text with similar length uses fewer tokens.';

		expect(tokenCounter.countTokens(unicodeText)).toBeGreaterThan(
			tokenCounter.countTokens(asciiText)
		);
	});

	test('getTokenCountsFromResponse extracts token counts correctly', () => {
		// Test with OpenAI-like response format
		const openaiResponse = {
			usage: {
				prompt_tokens: 50,
				completion_tokens: 120,
			},
		};

		expect(tokenCounter.getTokenCountsFromResponse(openaiResponse)).toEqual({
			promptTokens: 50,
			completionTokens: 120,
		});

		// Test with our custom format
		const customResponse = {
			promptTokens: 30,
			completionTokens: 80,
		};

		expect(tokenCounter.getTokenCountsFromResponse(customResponse)).toEqual({
			promptTokens: 30,
			completionTokens: 80,
		});

		// Test fallback to estimation
		const textResponse = {
			prompt: 'What are good ingredients for pasta?',
			reply: 'For a great pasta, you need quality pasta, fresh tomatoes, olive oil, and basil.',
		};

		const result = tokenCounter.getTokenCountsFromResponse(textResponse);
		expect(result.promptTokens).toBeGreaterThan(0);
		expect(result.completionTokens).toBeGreaterThan(0);

		// Test empty response
		expect(tokenCounter.getTokenCountsFromResponse(null)).toEqual({
			promptTokens: 0,
			completionTokens: 0,
		});
	});
});
