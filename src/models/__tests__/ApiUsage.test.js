/**
 * Jest test file for ApiUsage model
 * Run with: npm test -- models/ApiUsage.test.js
 */

import mongoose from 'mongoose';
import dbConnect from '../../lib/mongoose';
import ApiUsage from '../ApiUsage';

// Mock mongoose to avoid actual database connections
jest.mock('../../lib/mongoose', () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue(true),
}));

// Mock the mongoose methods we need
jest.mock('mongoose', () => {
	const actualMongoose = jest.requireActual('mongoose');

	return {
		...actualMongoose,
		model: jest.fn().mockImplementation((modelName) => {
			if (modelName === 'ApiUsage') {
				return function (data) {
					this.data = data;
					this.trackingId = data.trackingId;
					this.minuteHits = data.minuteHits || 0;
					this.monthHits = data.monthHits || 0;
					this.dayAssistantCalls = data.dayAssistantCalls || 0;
					this.dayAssistantTokens = data.dayAssistantTokens || 0;
					this.lastMinuteReset = data.lastMinuteReset || new Date();
					this.lastDayReset = data.lastDayReset || new Date();
					this.lastMonthReset = data.lastMonthReset || new Date();
					this.save = jest.fn().mockResolvedValue(this);
				};
			}
			return actualMongoose.model(modelName);
		}),
		Schema: actualMongoose.Schema,
	};
});

describe('ApiUsage Model', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should create a new ApiUsage record', async () => {
		const usageData = {
			trackingId: 'test',
			minuteHits: 1,
			monthHits: 1,
			dayAssistantCalls: 1,
			dayAssistantTokens: 100,
		};

		const usage = new ApiUsage(usageData);

		expect(usage.trackingId).toBe('test');
		expect(usage.minuteHits).toBe(1);
		expect(usage.monthHits).toBe(1);
		expect(usage.dayAssistantCalls).toBe(1);
		expect(usage.dayAssistantTokens).toBe(100);
	});

	test('should have default values for reset timestamps', () => {
		const usage = new ApiUsage({ trackingId: 'test' });

		expect(usage.trackingId).toBe('test');
		expect(usage.minuteHits).toBe(0);
		expect(usage.monthHits).toBe(0);
		expect(usage.dayAssistantCalls).toBe(0);
		expect(usage.dayAssistantTokens).toBe(0);
		expect(usage.lastMinuteReset).toBeInstanceOf(Date);
		expect(usage.lastDayReset).toBeInstanceOf(Date);
		expect(usage.lastMonthReset).toBeInstanceOf(Date);
	});

	test('should save the ApiUsage record', async () => {
		const usage = new ApiUsage({ trackingId: 'test' });
		await usage.save();

		expect(usage.save).toHaveBeenCalled();
	});

	test('should update counters correctly', async () => {
		const usage = new ApiUsage({
			trackingId: 'test',
			minuteHits: 5,
			monthHits: 100,
		});

		// Update counters
		usage.minuteHits += 1;
		usage.monthHits += 10;

		expect(usage.minuteHits).toBe(6);
		expect(usage.monthHits).toBe(110);

		await usage.save();
		expect(usage.save).toHaveBeenCalled();
	});
});
