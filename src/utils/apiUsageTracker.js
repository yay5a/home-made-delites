import ApiUsage from '../models/ApiUsage';
import dbConnect from '../lib/mongoose';

/**
 * Class for tracking and managing API usage
 */
export class ApiUsageTracker {
	/**
	 * Initialize the API Usage Tracker
	 */
	constructor() {
		// API Rate Limits
		this.API_LIMITS = {
			HITS_PER_MINUTE: 10,
			HITS_PER_MONTH: 10000,
			ASSISTANT_CALLS_PER_DAY: 30,
			ASSISTANT_TOKENS_PER_DAY: 10000,
		};
	}

	/**
	 * Get the current API usage statistics
	 * @returns {Promise<Object>} Current API usage data
	 */
	async getUsageData() {
		await dbConnect();

		let usage = await ApiUsage.findOne({ trackingId: 'global' });

		if (!usage) {
			usage = new ApiUsage({ trackingId: 'global' });
			await usage.save();
		}

		return {
			minuteHits: usage.minuteHits || 0,
			monthHits: usage.monthHits || 0,
			dayAssistantCalls: usage.dayAssistantCalls || 0,
			dayAssistantTokens: usage.dayAssistantTokens || 0,
			limits: this.API_LIMITS,
		};
	}

	/**
	 * Check if the API usage is within limits
	 * @param {string} type - Type of API call ('hit' or 'assistant')
	 * @returns {Promise<boolean>} Whether the usage is within limits
	 */
	async isWithinLimits(type = 'hit') {
		const usage = await this.getUsageData();

		if (type === 'hit') {
			return (
				usage.minuteHits < this.API_LIMITS.HITS_PER_MINUTE &&
				usage.monthHits < this.API_LIMITS.HITS_PER_MONTH
			);
		} else if (type === 'assistant') {
			return (
				usage.dayAssistantCalls < this.API_LIMITS.ASSISTANT_CALLS_PER_DAY &&
				usage.dayAssistantTokens < this.API_LIMITS.ASSISTANT_TOKENS_PER_DAY
			);
		}

		return false;
	}

	/**
	 * Get the percentage of usage relative to the limit
	 * @param {string} type - Type of API call ('hit' or 'assistant')
	 * @param {string} timeframe - Timeframe to check ('minute', 'day', 'month')
	 * @returns {Promise<number>} Percentage of usage (0-100)
	 */
	async getUsagePercentage(type = 'hit', timeframe = 'minute') {
		const usage = await this.getUsageData();

		if (type === 'hit') {
			if (timeframe === 'minute') {
				return (usage.minuteHits / this.API_LIMITS.HITS_PER_MINUTE) * 100;
			} else if (timeframe === 'month') {
				return (usage.monthHits / this.API_LIMITS.HITS_PER_MONTH) * 100;
			}
		} else if (type === 'assistant') {
			if (timeframe === 'day') {
				return (usage.dayAssistantCalls / this.API_LIMITS.ASSISTANT_CALLS_PER_DAY) * 100;
			}
		}

		return 0;
	}
}

export default ApiUsageTracker;
