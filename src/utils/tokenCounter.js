// A more accurate token estimator for GPT-3 and similar LLMs
// Based on research showing character count is not an accurate way to estimate tokens

/**
 * More accurate token estimation using character and word-based heuristics
 * This implementation is based on observed token patterns in GPT models:
 * - Simple ASCII characters: ~4 chars per token
 * - Common English words are typically 1 token each
 * - Numbers and special characters often split into separate tokens
 * - Unicode characters may use more tokens
 *
 * @param {string} text - The text to estimate tokens for
 * @returns {number} - A more accurate token count estimate
 */
export function countTokens(text) {
	if (!text) return 0;

	// Split the text into words
	const words = text.trim().split(/\s+/);

	// Initial token count based on words (most common English words are 1 token)
	let tokenCount = words.length;

	// Adjust for special characters, numbers, and long words
	for (const word of words) {
		// Very long words are typically multiple tokens
		if (word.length > 12) {
			// Add extra tokens for very long words
			tokenCount += Math.floor(word.length / 8);
		}

		// Numbers and special characters often split into more tokens
		const specialChars = word.match(/[^a-zA-Z0-9\s]/g) || [];
		tokenCount += specialChars.length * 0.2; // Partial token addition for special chars

		// Check for number sequences which often break into separate tokens
		if (/\d{4,}/.test(word)) {
			tokenCount += Math.floor(word.match(/\d/g).length / 3);
		}
	}

	// Add tokens for punctuation outside of words
	const punctuation = text.match(/[,.;:!?()[\]{}'"]/g) || [];
	tokenCount += punctuation.length * 0.3;

	// Check for non-ASCII unicode characters which typically use more tokens
	const nonAscii = text.match(/[^\x00-\x7F]/g) || [];
	tokenCount += nonAscii.length;

	// Account for whitespace
	const newlines = (text.match(/\n/g) || []).length;
	tokenCount += newlines * 0.5; // Newlines often count as partial tokens

	// Round up to the nearest integer
	return Math.ceil(tokenCount);
}

/**
 * Estimate tokens for a given text string
 * Provides a more accurate estimation than simple character division
 * @param {string} text - Text to estimate tokens for
 * @returns {number} - Estimated token count
 */
export function estimateTokens(text) {
	if (!text) return 0;
	return countTokens(text);
}

/**
 * Get token counts from API response if available
 * @param {Object} response - API response that may include token counts
 * @returns {Object} - Object with promptTokens and completionTokens
 */
export function getTokenCountsFromResponse(response) {
	if (!response) return { promptTokens: 0, completionTokens: 0 };

	// Check if the response includes token counts (from actual AI service)
	if (response.usage && typeof response.usage.prompt_tokens === 'number') {
		return {
			promptTokens: response.usage.prompt_tokens,
			completionTokens: response.usage.completion_tokens || 0,
		};
	}

	// If we have our own token count fields
	if (typeof response.promptTokens === 'number') {
		return {
			promptTokens: response.promptTokens,
			completionTokens: response.completionTokens || 0,
		};
	}

	// Fallback to estimation if we need to calculate
	if (response.prompt && response.reply) {
		return {
			promptTokens: countTokens(response.prompt),
			completionTokens: countTokens(response.reply),
		};
	}

	// No information available
	return { promptTokens: 0, completionTokens: 0 };
}

const tokenCounter = {
	estimateTokens,
	countTokens,
	getTokenCountsFromResponse,
};

export default tokenCounter;
