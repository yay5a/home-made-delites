import { trackApiUsage } from './edamamUtils';

// Constants for API limits
const ASSISTANT_API_LIMITS = {
	CALLS_PER_DAY: 30,
	TOKENS_PER_DAY: 10000,
};

/**
 * Track Assistant API usage and manage rate limits
 * @param {string} endpoint - The assistant endpoint being accessed
 * @param {number} estimatedTokens - Estimated number of tokens used
 * @returns {Promise<boolean>} - Whether the call is allowed
 */
export async function trackAssistantUsage(endpoint, estimatedTokens = 0) {
	try {
		// Track the API call with estimated tokens
		return trackApiUsage('assistant', estimatedTokens);
	} catch (error) {
		console.error('Assistant API usage error:', error);
		throw error;
	}
}

/**
 * Estimate tokens for a given text string
 * Very rough approximation: ~4 chars per token on average
 * @param {string} text - Text to estimate tokens for
 * @returns {number} - Estimated token count
 */
export function estimateTokens(text) {
	if (!text) return 0;
	return Math.ceil(text.length / 4);
}

/**
 * Make an assistant API call with rate limiting
 * @param {string} endpoint - The assistant API endpoint
 * @param {Object} payload - Request payload
 * @returns {Promise<Object>} - API response
 */
export async function callAssistantApi(endpoint, payload) {
	try {
		// Estimate tokens for this call based on the payload size
		const payloadString = JSON.stringify(payload);
		const estimatedTokens = estimateTokens(payloadString);

		// Track usage and check limits
		await trackAssistantUsage(endpoint, estimatedTokens);

		// Make the API call - replace with your actual assistant API call implementation
		const response = await fetch(`/api/assistant/${endpoint}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: payloadString,
		});

		if (!response.ok) {
			throw new Error(`Assistant API error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Assistant API call failed:', error);
		throw error;
	}
}

/**
 * Gets remaining assistant API quota for the day
 * Accesses the apiUsage data from localStorage
 * @returns {Object} - Object containing remaining calls and tokens
 */
export function getRemainingAssistantQuota() {
	try {
		// Access stored API usage data
		const storedUsage = localStorage.getItem('apiUsage');
		if (!storedUsage) {
			return {
				remainingCalls: ASSISTANT_API_LIMITS.CALLS_PER_DAY,
				remainingTokens: ASSISTANT_API_LIMITS.TOKENS_PER_DAY,
			};
		}

		const usage = JSON.parse(storedUsage);

		// Calculate remaining quota
		const remainingCalls = Math.max(
			0,
			ASSISTANT_API_LIMITS.CALLS_PER_DAY - (usage.dayAssistantCalls || 0)
		);
		const remainingTokens = Math.max(
			0,
			ASSISTANT_API_LIMITS.TOKENS_PER_DAY - (usage.dayAssistantTokens || 0)
		);

		return { remainingCalls, remainingTokens };
	} catch (error) {
		console.error('Error calculating assistant quota:', error);
		// Return default values in case of error
		return {
			remainingCalls: 5,
			remainingTokens: 2000,
		};
	}
}

/**
 * Checks if a new assistant interaction would exceed limits
 * @param {string} prompt - Proposed user prompt
 * @returns {boolean} - Whether the interaction would be allowed
 */
export function canUseAssistant(prompt) {
	try {
		// Estimate tokens for the prompt and a potential response
		const promptTokens = estimateTokens(prompt);
		// Assume worst-case response is 4x prompt length
		const estimatedResponseTokens = promptTokens * 4;
		const totalEstimatedTokens = promptTokens + estimatedResponseTokens;

		const quota = getRemainingAssistantQuota();

		return quota.remainingCalls > 0 && quota.remainingTokens >= totalEstimatedTokens;
	} catch (error) {
		console.error('Error checking assistant availability:', error);
		return false;
	}
}

/**
 * Provides feedback to user about remaining assistant quota
 * @returns {string} - User-friendly message about quota
 */
export function getAssistantQuotaMessage() {
	const quota = getRemainingAssistantQuota();

	if (quota.remainingCalls <= 0) {
		return "You've reached your daily limit of recipe assistant interactions. Please try again tomorrow.";
	}

	if (quota.remainingTokens < 500) {
		return `You have ${quota.remainingCalls} assistant interactions remaining today, but your token usage is limited. Please keep questions brief.`;
	}

	return `You have ${quota.remainingCalls} recipe assistant interactions remaining today.`;
}
