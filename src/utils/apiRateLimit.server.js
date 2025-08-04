// Server-side API rate limiting functionality
// Only import this file on server-side code (API routes, Server Components)

import dbConnect from '../lib/mongoose';
import ApiUsage from '../models/ApiUsage';
import { API_LIMITS } from '@/config/apiLimits';

/**
 * Track API usage and enforce rate limits with MongoDB persistence
 * @param {string} type - Type of API call ('edamam' or 'assistant')
 * @param {number} tokens - Number of tokens used (for assistant calls)
 * @throws {Error} - If rate limit is exceeded
 * @returns {Promise<boolean>} - Whether the call is allowed
 */
export async function trackApiUsage(type = 'edamam', tokens = 0) {
	await dbConnect();

	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

	// Get or create today's usage record
	let usage = await ApiUsage.findOne({ date: today });
	if (!usage) {
		usage = new ApiUsage({ date: today });
	}

	// Check and update based on type
	if (type === 'edamam') {
		// Check minute-based rate limit
		const recentHits = await ApiUsage.aggregate([
			{
				$match: {
					'hits.timestamp': { $gte: oneMinuteAgo },
				},
			},
			{
				$unwind: '$hits',
			},
			{
				$match: {
					'hits.timestamp': { $gte: oneMinuteAgo },
				},
			},
			{
				$count: 'recentHits',
			},
		]);

		const recentHitsCount = recentHits.length > 0 ? recentHits[0].recentHits : 0;
		if (recentHitsCount >= API_LIMITS.HITS_PER_MINUTE) {
			throw new Error('Rate limit exceeded: Too many requests per minute');
		}

		// Check monthly rate limit
		const monthlyHits = await ApiUsage.aggregate([
			{
				$match: {
					date: { $gte: thisMonth },
				},
			},
			{
				$group: {
					_id: null,
					totalHits: { $sum: { $size: '$hits' } },
				},
			},
		]);

		const monthlyHitsCount = monthlyHits.length > 0 ? monthlyHits[0].totalHits : 0;
		if (monthlyHitsCount >= API_LIMITS.HITS_PER_MONTH) {
			throw new Error('Rate limit exceeded: Monthly API quota reached');
		}

		// Record this hit
		usage.hits.push({
			timestamp: now,
			endpoint: '/api/recipes',
		});
	} else if (type === 'assistant') {
		// Check daily rate limit for assistant calls
		if (usage.assistantCalls.length >= API_LIMITS.ASSISTANT_CALLS_PER_DAY) {
			throw new Error('Rate limit exceeded: Daily assistant call quota reached');
		}

		// Check token limit
		const dailyTokens = usage.assistantCalls.reduce((sum, call) => sum + call.tokens, 0);
		if (dailyTokens + tokens > API_LIMITS.ASSISTANT_TOKENS_PER_DAY) {
			throw new Error('Rate limit exceeded: Daily assistant token quota reached');
		}

		// Record this assistant call
		usage.assistantCalls.push({
			timestamp: now,
			tokens: tokens,
		});
	}

	await usage.save();
	return true;
}

/**
 * Get current API usage statistics
 * @returns {Promise<Object>} - API usage statistics
 */
export async function getApiUsage() {
	await dbConnect();

	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	// Get today's usage
	const todayUsage = await ApiUsage.findOne({ date: today });

	// Get monthly usage
	const monthlyUsage = await ApiUsage.aggregate([
		{
			$match: {
				date: { $gte: thisMonth },
			},
		},
		{
			$group: {
				_id: null,
				totalHits: { $sum: { $size: '$hits' } },
				totalAssistantCalls: { $sum: { $size: '$assistantCalls' } },
				totalAssistantTokens: {
					$sum: {
						$reduce: {
							input: '$assistantCalls',
							initialValue: 0,
							in: { $add: ['$$value', '$$this.tokens'] },
						},
					},
				},
			},
		},
	]);

	return {
		edamamHits: {
			today: todayUsage ? todayUsage.hits.length : 0,
			thisMonth: monthlyUsage.length > 0 ? monthlyUsage[0].totalHits : 0,
		},
		assistantCalls: {
			today: todayUsage ? todayUsage.assistantCalls.length : 0,
		},
		assistantTokens: {
			today: todayUsage
				? todayUsage.assistantCalls.reduce((sum, call) => sum + call.tokens, 0)
				: 0,
		},
		limits: API_LIMITS,
	};
}
