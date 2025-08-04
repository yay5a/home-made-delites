/**
 * @file interactionUtils.js
 * @description Utilities for enhanced micro-interactions and animations
 * Addresses analysis issue #6: Minimal interactive feedback
 */

/**
 * Interactive element states and animation utilities
 * For consistent microinteractions across the app
 */

import { cx } from '@/styles/styleUtils';

// Base transition classes for different interaction types
export const transitions = {
	button: 'transition-all duration-200 ease-in-out',
	hover: 'transition-transform duration-150 ease-in-out',
	expand: 'transition-all duration-300 ease-in-out',
	fade: 'transition-opacity duration-300 ease-in-out',
	scale: 'transition-transform duration-200 ease-out',
};

// Hover effects to apply to interactive elements
export const hoverEffects = {
	grow: 'hover:scale-105',
	lift: 'hover:-translate-y-1',
	glow: 'hover:shadow-md',
	brighten: 'hover:brightness-110',
	highlight: 'hover:ring-2 hover:ring-primary-200',
};

// Focus styles for better accessibility and visual feedback
export const focusEffects = {
	outline: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
	subtleOutline: 'focus:outline-none focus:ring-1 focus:ring-primary-500',
	borderHighlight: 'focus:border-primary-500',
};

// Active/pressed state effects
export const activeEffects = {
	press: 'active:scale-95',
	sink: 'active:translate-y-0.5',
	clickFeedback: 'active:bg-opacity-80',
};

// Success feedback animations
export const successAnimations = {
	pulse: 'animate-[pulse_1s_ease-in-out]',
	checkmark: 'animate-[checkmark_0.5s_ease-in-out_forwards]',
	success: 'animate-[success-fade_1s_ease-in-out]',
};

// Error feedback animations
export const errorAnimations = {
	shake: 'animate-[shake_0.5s_ease-in-out]',
	flash: 'animate-[flash_0.5s_ease-in-out]',
};

// Loading state animations
export const loadingAnimations = {
	spin: 'animate-spin',
	pulse: 'animate-pulse',
	ping: 'animate-ping',
};

/**
 * Creates a class string for an enhanced button with micro-interactions
 * @param {string} baseClasses - Base tailwind classes for the button
 * @param {boolean} isInteractive - Whether the button should have interactive states
 * @returns {string} Complete class string with micro-interactions
 */
export function createEnhancedButtonClasses(baseClasses, isInteractive = true) {
	if (!isInteractive) return baseClasses;

	return cx(
		baseClasses,
		transitions.button,
		hoverEffects.grow,
		activeEffects.press,
		focusEffects.outline
	);
}

/**
 * Creates a class string for an enhanced card with micro-interactions
 * @param {string} baseClasses - Base tailwind classes for the card
 * @param {boolean} isInteractive - Whether the card should have interactive states
 * @returns {string} Complete class string with micro-interactions
 */
export function createEnhancedCardClasses(baseClasses, isInteractive = true) {
	if (!isInteractive) return baseClasses;

	return cx(baseClasses, transitions.expand, hoverEffects.glow, 'hover:border-primary-300');
}

/**
 * Creates a class string for enhanced form controls with micro-interactions
 * @param {string} baseClasses - Base tailwind classes for the form control
 * @returns {string} Complete class string with micro-interactions
 */
export function createEnhancedFormClasses(baseClasses) {
	return cx(baseClasses, transitions.button, focusEffects.borderHighlight, 'hover:border-neutral-400');
}

/**
 * Set of common interactive elements with enhanced micro-interactions
 * Ready-to-use components with proper feedback
 */
export const interactiveElements = {
	// Enhanced link styles
	link: cx(
		'text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300',
		transitions.button,
		'hover:underline',
		focusEffects.subtleOutline
	),

	// Card with hover/focus states
	card: cx(
		'bg-white dark:bg-dark-card rounded-lg shadow-sm border border-neutral-200 dark:border-dark-border overflow-hidden',
		transitions.expand,
		hoverEffects.glow,
		'hover:border-primary-300'
	),

	// Interactive list item
	listItem: cx(
		'px-4 py-3 rounded-md',
		transitions.hover,
		'hover:bg-neutral-50 dark:hover:bg-neutral-800',
		focusEffects.subtleOutline
	),

	// Icon button with feedback
	iconButton: cx(
		'p-2 rounded-full',
		transitions.button,
		hoverEffects.grow,
		activeEffects.press,
		focusEffects.outline,
		'hover:bg-neutral-100 dark:hover:bg-neutral-800'
	),

	// Tab with active state
	tab: (isActive) =>
		cx(
			'px-4 py-2 font-medium rounded-md',
			transitions.button,
			isActive
				? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:bg-opacity-30 dark:text-primary-300'
				: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800',
			focusEffects.subtleOutline
		),
};

const interactionUtils = {
	transitions,
	hoverEffects,
	focusEffects,
	activeEffects,
	successAnimations,
	errorAnimations,
	loadingAnimations,
	createEnhancedButtonClasses,
	createEnhancedCardClasses,
	createEnhancedFormClasses,
	interactiveElements,
};

export default interactionUtils;
