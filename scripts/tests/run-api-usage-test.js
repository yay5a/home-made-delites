#!/usr/bin/env node

/**
 * Helper script to run API usage tests manually
 */

console.log('Running API Usage tests...');

// Import Jest programmatically
const { runCLI } = require('@jest/core');

// Run just the API Usage tests
const config = {
	roots: ['<rootDir>/src'],
	testMatch: ['<rootDir>/src/models/__tests__/ApiUsage.test.js'],
	verbose: true,
};

runCLI(config, [process.cwd()])
	.then(({ results }) => {
		if (results.success) {
			console.log('✅ API Usage tests passed successfully!');
		} else {
			console.error('❌ API Usage tests failed');
			process.exit(1);
		}
	})
	.catch((error) => {
		console.error('Error running tests:', error);
		process.exit(1);
	});
