// Server-side API rate limiting functionality - Optimized version
// Only import this file on server-side code (API routes, Server Components)

import dbConnect from '../lib/mongoose';
import ApiUsage from '../models/ApiUsage';
import { API_LIMITS } from '@/config/apiLimits';
import logger from '@/utils/logger';

// Constants for time tracking
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const MONTH = 30 * DAY; // Approximate

/**
 * Get or create usage tracker with automatic reset functionality
 * @returns {Promise<Object>} The API usage tracker
 */
async function getOrCreateTracker() {
	await dbConnect();
	const now = Date.now();

	// Find or create the global tracker
	let tracker = await ApiUsage.findOne({ trackingId: 'global' });

	if (!tracker) {
		// Initialize a new tracker if none exists
		tracker = new ApiUsage({
			trackingId: 'global',
			lastMinuteReset: now,
			lastDayReset: now,
			lastMonthReset: now,
		});
	}

	// Check if resets are needed - do this in one place to avoid multiple checks
	const needsMinuteReset = now - tracker.lastMinuteReset.getTime() > MINUTE;
	const needsDayReset = now - tracker.lastDayReset.getTime() > DAY;
	const needsMonthReset = now - tracker.lastMonthReset.getTime() > MONTH;

	// Apply resets if needed
	if (needsMinuteReset) {
		tracker.minuteHits = 0;
		tracker.lastMinuteReset = now;
		logger.debug('Reset minute-based tracking');
	}

	if (needsDayReset) {
		tracker.dayAssistantCalls = 0;
		tracker.dayAssistantTokens = 0;
		tracker.lastDayReset = now;
		logger.debug('Reset day-based tracking');
	}

	if (needsMonthReset) {
		tracker.monthHits = 0;
		tracker.monthAssistantCalls = 0;
		tracker.lastMonthReset = now;
		logger.debug('Reset month-based tracking');
	}

	return tracker;
}

/**
 * Track API usage and enforce rate limits - optimized version
 * Uses a single document with counter fields instead of arrays
 * @param {string} type - Type of API call ('edamam' or 'assistant')
 * @param {number} tokens - Number of tokens used (for assistant calls)
 * @throws {Error} - If rate limit is exceeded
 * @returns {Promise<boolean>} - Whether the call is allowed
 */
export async function trackApiUsage(type = 'edamam', tokens = 0) {
	const tracker = await getOrCreateTracker();

	// Check and update based on type - all in memory now, no additional DB queries
	if (type === 'edamam') {
		// Check minute-based rate limit
		if (tracker.minuteHits >= API_LIMITS.HITS_PER_MINUTE) {
			throw new Error('Rate limit exceeded: Too many requests per minute');
		}

		// Check monthly rate limit
		if (tracker.monthHits >= API_LIMITS.HITS_PER_MONTH) {
			throw new Error('Rate limit exceeded: Monthly API quota reached');
		}

		// Increment counters
		tracker.minuteHits += 1;
		tracker.monthHits += 1;
	} else if (type === 'assistant') {
		// Check daily rate limit for assistant calls
		if (tracker.dayAssistantCalls >= API_LIMITS.ASSISTANT_CALLS_PER_DAY) {
			throw new Error('Rate limit exceeded: Daily assistant call quota reached');
		}

		// Check token limit
		if (tracker.dayAssistantTokens + tokens > API_LIMITS.ASSISTANT_TOKENS_PER_DAY) {
			throw new Error('Rate limit exceeded: Daily assistant token quota reached');
		}

		// Increment counters
		tracker.dayAssistantCalls += 1;
		tracker.dayAssistantTokens += tokens;
		tracker.monthAssistantCalls += 1;
	}

	// Save changes in one go
	await tracker.save();
	return true;
}

/**
 * Get current API usage statistics - optimized version
 * @returns {Promise<Object>} - API usage statistics with all counters
 */
export async function getApiUsage() {
	const tracker = await getOrCreateTracker();

	// All data is now directly available, no need for aggregation
	return {
		edamamHits: {
			minute: tracker.minuteHits,
			thisMonth: tracker.monthHits,
			minuteResetIn: MINUTE - (Date.now() - tracker.lastMinuteReset.getTime()),
			monthResetIn: MONTH - (Date.now() - tracker.lastMonthReset.getTime()),
		},
		assistantCalls: {
			today: tracker.dayAssistantCalls,
			thisMonth: tracker.monthAssistantCalls,
			dayResetIn: DAY - (Date.now() - tracker.lastDayReset.getTime()),
		},
		assistantTokens: {
			today: tracker.dayAssistantTokens,
		},
		limits: API_LIMITS,
	};
}
