/**
 * Jest test file for logger utility
 * Run with: npm test -- utils/logger.test.js
 */

import logger from '../utils/logger';

// Mock console methods
global.console = {
	log: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};

describe('Logger Utility', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
	});

	test('logger.error should call console.error with properly formatted message', () => {
		const message = 'Test error message';
		const error = new Error('Test error');

		logger.error(message, error);

		expect(console.error).toHaveBeenCalled();
		const calledWith = console.error.mock.calls[0][0];
		expect(calledWith).toContain('[ERROR] Test error message');
		expect(calledWith).toContain(error.toString());
	});

	test('logger.warn should call console.warn with properly formatted message', () => {
		logger.warn('Warning message', { data: 'test data' });

		expect(console.warn).toHaveBeenCalled();
		const calledWith = console.warn.mock.calls[0][0];
		expect(calledWith).toContain('[WARN] Warning message');
		expect(calledWith).toContain('test data');
	});

	test('logger.info should call console.info with properly formatted message', () => {
		logger.info('Info message');

		expect(console.info).toHaveBeenCalled();
		const calledWith = console.info.mock.calls[0][0];
		expect(calledWith).toContain('[INFO] Info message');
	});

	test('logger.debug should call console.log with properly formatted message', () => {
		logger.debug('Debug message', 123);

		expect(console.log).toHaveBeenCalled();
		const calledWith = console.log.mock.calls[0][0];
		expect(calledWith).toContain('[DEBUG] Debug message');
		expect(calledWith).toContain('123');
	});
});
