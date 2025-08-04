/**
 * Jest configuration file for testing Home Made Delites application
 */

module.exports = {
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/src'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		// Use Babel to transform JS/JSX files
		'^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
	},
	collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/**/*.d.ts', '!**/node_modules/**'],
	testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
	transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx}'],
	moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
