import { trackApiUsage } from './edamamUtils';
import { ASSISTANT_API_LIMITS } from '@/config/apiLimits';
import tokenCounter from './tokenCounter';

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
 * Uses a more accurate token counting algorithm
 * @param {string} text - Text to estimate tokens for
 * @returns {number} - Estimated token count
 */
export function estimateTokens(text) {
	if (!text) return 0;
	return tokenCounter.countTokens(text);
}

/**
 * Make an assistant API call with rate limiting
 * @param {string} endpoint - The assistant API endpoint
 * @param {Object} payload - Request payload
 * @returns {Promise<Object>} - API response
 */
export async function callAssistantApi(endpoint, payload) {
	try {
		// Estimate tokens for this call based on the prompt
		const promptTokens = payload.prompt ? estimateTokens(payload.prompt) : 0;

		// For initial quota check, estimate a reasonable upper bound
		// We'll update with actual values from the response later
		const initialTokenEstimate = promptTokens * 2; // Conservative initial estimate

		// Track usage and check limits with initial estimate
		await trackAssistantUsage(endpoint, initialTokenEstimate);

		// Make the API call - replace with your actual assistant API call implementation
		const payloadString = JSON.stringify(payload);
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

		const responseData = await response.json();

		// Get actual token counts from the response
		const { promptTokens: actualPromptTokens, completionTokens } =
			tokenCounter.getTokenCountsFromResponse(responseData);

		// Update token usage with the actual values minus what we already tracked
		const additionalTokens = actualPromptTokens + completionTokens - initialTokenEstimate;
		if (additionalTokens > 0) {
			// Only track additional usage if our estimate was too low
			await trackAssistantUsage(endpoint, additionalTokens);
		}

		return responseData;
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
		// Estimate tokens for the prompt using our accurate token counter
		const promptTokens = estimateTokens(prompt);

		// Use dynamic ratio based on prompt length - shorter prompts tend to have
		// relatively longer responses, while longer prompts have more concise responses
		let responseRatio;
		if (promptTokens <= 10) {
			responseRatio = 6; // Very short prompts often get longer responses
		} else if (promptTokens <= 50) {
			responseRatio = 4; // Short prompts
		} else if (promptTokens <= 200) {
			responseRatio = 3; // Medium length prompts
		} else {
			responseRatio = 2; // Long prompts tend to get more concise responses
		}

		const estimatedResponseTokens = promptTokens * responseRatio;
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
