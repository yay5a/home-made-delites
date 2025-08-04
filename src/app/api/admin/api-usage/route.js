import { NextResponse } from 'next/server';
import ApiUsage from '@/models/ApiUsage';
import dbConnect from '@/lib/mongoose';
import { verifyToken } from '@/lib/authService';
import { API_LIMITS } from '@/utils/edamamUtils';

/**
 * API endpoint to retrieve API usage statistics
 * Protected for admin users only
 */
export async function GET(request) {
	try {
		// Get authentication token
		const authHeader = request.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
		}

		// Verify token and check admin role
		const token = authHeader.split(' ')[1];
		const decoded = verifyToken(token);

		if (decoded.role !== 'admin') {
			return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
		}

		// Connect to database
		await dbConnect();

		// Get timeframe from query param
		const { searchParams } = new URL(request.url);
		const timeframe = searchParams.get('timeframe') || 'today';

		// Get API usage from database
		const usage = await ApiUsage.findOne({ trackingId: 'global' });

		if (!usage) {
			return NextResponse.json({
				success: true,
				data: {
					minuteHits: {
						current: 0,
						limit: API_LIMITS.HITS_PER_MINUTE,
						percentUsed: 0,
					},
					monthHits: {
						current: 0,
						limit: API_LIMITS.HITS_PER_MONTH,
						percentUsed: 0,
					},
					assistantCalls: {
						current: 0,
						limit: API_LIMITS.ASSISTANT_CALLS_PER_DAY,
						percentUsed: 0,
					},
					assistantTokens: {
						current: 0,
						limit: API_LIMITS.ASSISTANT_TOKENS_PER_DAY,
						percentUsed: 0,
					},
					timeframe,
				},
			});
		}

		// Calculate percentages and format response
		const usageStats = {
			minuteHits: {
				current: usage.minuteHits,
				limit: API_LIMITS.HITS_PER_MINUTE,
				percentUsed: (usage.minuteHits / API_LIMITS.HITS_PER_MINUTE) * 100,
				resetsIn: Math.max(0, 60 - Math.floor((Date.now() - usage.lastMinuteReset) / 1000)),
			},
			monthHits: {
				current: usage.monthHits,
				limit: API_LIMITS.HITS_PER_MONTH,
				percentUsed: (usage.monthHits / API_LIMITS.HITS_PER_MONTH) * 100,
			},
			assistantCalls: {
				current: usage.dayAssistantCalls,
				limit: API_LIMITS.ASSISTANT_CALLS_PER_DAY,
				percentUsed: (usage.dayAssistantCalls / API_LIMITS.ASSISTANT_CALLS_PER_DAY) * 100,
			},
			assistantTokens: {
				current: usage.dayAssistantTokens,
				limit: API_LIMITS.ASSISTANT_TOKENS_PER_DAY,
				percentUsed: (usage.dayAssistantTokens / API_LIMITS.ASSISTANT_TOKENS_PER_DAY) * 100,
			},
			timeframe,
			lastUpdated: usage.updatedAt,
		};

		return NextResponse.json({
			success: true,
			data: usageStats,
		});
	} catch (error) {
		console.error('Error fetching API usage statistics:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to retrieve API usage statistics' },
			{ status: 500 }
		);
	}
}

/**
 * Reset API usage counters (admin only)
 */
export async function POST(request) {
	try {
		// Get authentication token
		const authHeader = request.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
		}

		// Verify token and check admin role
		const token = authHeader.split(' ')[1];
		const decoded = verifyToken(token);

		if (decoded.role !== 'admin') {
			return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
		}

		// Connect to database
		await dbConnect();

		const body = await request.json();
		const { type, timeframe } = body;

		if (!type || !['recipe', 'assistant', 'all'].includes(type)) {
			return NextResponse.json({ error: 'Invalid reset type' }, { status: 400 });
		}

		if (!timeframe || !['minute', 'day', 'month', 'all'].includes(timeframe)) {
			return NextResponse.json({ error: 'Invalid timeframe' }, { status: 400 });
		}

		// Get or create usage document
		let usage = await ApiUsage.findOne({ trackingId: 'global' });

		if (!usage) {
			usage = new ApiUsage({ trackingId: 'global' });
		}

		// Reset counters based on type and timeframe
		if (timeframe === 'all' || timeframe === 'minute') {
			if (type === 'all' || type === 'recipe') {
				usage.minuteHits = 0;
				usage.lastMinuteReset = Date.now();
			}
		}

		if (timeframe === 'all' || timeframe === 'day') {
			if (type === 'all' || type === 'assistant') {
				usage.dayAssistantCalls = 0;
				usage.dayAssistantTokens = 0;
				usage.lastDayReset = new Date().setHours(0, 0, 0, 0);
			}
		}

		if (timeframe === 'all' || timeframe === 'month') {
			if (type === 'all' || type === 'recipe') {
				usage.monthHits = 0;
				usage.lastMonthReset = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
			}
		}

		// Save changes
		await usage.save();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error resetting API usage counters:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to reset API usage counters' },
			{ status: 500 }
		);
	}
}
