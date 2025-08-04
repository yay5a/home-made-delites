/**
 * Jest setup file for Home Made Delites application
 * This file is run before each test file
 */

// Set up ENV variables for testing
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000';
process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-home-made-delites';

// Mock the global fetch
global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
		ok: true,
	})
);

// Reset mocks before each test
beforeEach(() => {
	jest.clearAllMocks();
});
