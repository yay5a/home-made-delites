/**
 * @file styleUtils.js
 * @description Utility functions for working with styles
 * This file provides helper functions and re-exports from the design system
 */

// Import the design system tokens and styles
import designSystem from './designSystem';
export const { tokens, styles } = designSystem;

/**
 * Helper function to conditionally join classNames together
 * @param {...string} classes - CSS class names to conditionally join
 * @returns {string} - Joined class names with no falsy values
 */
export function cx(...classes) {
	return classes.filter(Boolean).join(' ');
}

// Re-export legacy style categories to maintain backward compatibility
// These will eventually be deprecated in favor of the design system
export const layoutStyles = {
	container: tokens.components.container.base,
	section: tokens.spacing.section,
	card: tokens.components.card.base,
	cardHover: tokens.components.card.interactive,
	grid: tokens.layout.grid,
	flex: {
		center: tokens.layout.center,
		between: tokens.layout.between,
		column: tokens.layout.flexCol,
		row: tokens.layout.flexRow,
	},
};

export const textStyles = {
	h1: tokens.typography.headings.h1,
	h2: tokens.typography.headings.h2,
	h3: tokens.typography.headings.h3,
	h4: tokens.typography.headings.h4,
	body: tokens.typography.body.default,
	bodyLg: tokens.typography.body.lg,
	bodySm: tokens.typography.body.sm,
	label: tokens.typography.special.label,
	error: tokens.typography.special.error,
	muted: tokens.typography.special.caption,
	truncate: 'truncate',
	lineClamp1: 'line-clamp-1',
	lineClamp2: 'line-clamp-2',
	lineClamp3: 'line-clamp-3',
};

// Form element styles
export const formStyles = {
	// Input classes - base styles for form inputs
	input:
		tokens.components.input.base +
		' ' +
		tokens.components.input.text +
		' ' +
		tokens.components.input.weight +
		' ' +
		tokens.components.input.placeholder +
		' ' +
		tokens.components.input.variants.default +
		' ' +
		tokens.components.input.sizes.md,

	// Label styles
	label: tokens.typography.special.label + ' mb-1',

	// Form group
	formGroup: 'mb-4',

	// Validation states
	error: tokens.components.input.variants.error,
	success: tokens.components.input.variants.success,
};

// Animation styles
export const animationStyles = {
	pulse: 'animate-pulse',
	spin: 'animate-spin',
	fadeIn: 'animate-fadeIn',
	transition: 'transition-all duration-300',
};

// Spacing utilities - for consistent spacing
export const spacingStyles = {
	mb1: 'mb-1',
	mb2: 'mb-2',
	mb4: 'mb-4',
	mb6: 'mb-6',
	mb8: 'mb-8',
	mb12: 'mb-12',
	mt1: 'mt-1',
	mt2: 'mt-2',
	mt4: 'mt-4',
	mt6: 'mt-6',
	mt8: 'mt-8',
	p4: 'p-4',
	p6: 'p-6',
	py4: 'py-4',
	py6: 'py-6',
};

// Legacy helper function definition removed
// Now imported from the design system file
