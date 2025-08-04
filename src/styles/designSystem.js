/**
 * @file designSystem.js
 * @description Centralized design system tokens and component styles
 * This file defines the design language for Home Made Delites and provides
 * reusable style compositions for consistent UI across the application
 */

// Import our theme utilities
import { cx } from './styleUtils';

/**
 * Design Tokens
 * These tokens represent the core visual elements of our design system
 */
export const tokens = {
	// Base component styles
	components: {
		// Container styles
		container: {
			base: 'mx-auto px-4 sm:px-6 lg:px-8',
			max: {
				sm: 'max-w-screen-sm',
				md: 'max-w-screen-md',
				lg: 'max-w-screen-lg',
				xl: 'max-w-screen-xl',
				'2xl': 'max-w-screen-2xl',
				full: 'max-w-full',
			},
		},

		// Card styles
		card: {
			base: 'bg-white dark:bg-dark-card rounded-lg overflow-hidden',
			variants: {
				default: 'border border-gray-200 dark:border-dark-border shadow-sm',
				elevated: 'shadow-md',
				flat: 'border border-gray-200 dark:border-dark-border',
			},
			interactive:
				'transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500',
		},

		// Button styles
		button: {
			base: 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
			sizes: {
				xs: 'px-2 py-1 text-xs',
				sm: 'px-3 py-1.5 text-sm',
				md: 'px-4 py-2 text-sm',
				lg: 'px-6 py-3 text-base',
				xl: 'px-8 py-4 text-lg',
			},
			variants: {
				primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
				secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500',
				outline:
					'border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 focus:ring-primary-500',
				danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
				ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500',
				link: 'text-primary-600 hover:text-primary-700 underline p-0 focus:ring-0',
			},
		},

		// Input styles
		input: {
			base: 'block w-full rounded-md transition-colors focus:outline-none',
			variants: {
				default:
					'border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
				error: 'border border-error-300 focus:ring-2 focus:ring-error-500 focus:border-error-500',
				success:
					'border border-success-300 focus:ring-2 focus:ring-success-500 focus:border-success-500',
			},
			sizes: {
				sm: 'px-2 py-1 text-sm',
				md: 'px-3 py-2 text-base',
				lg: 'px-4 py-3 text-lg',
			},
			// Accessibility and visual improvements
			text: 'text-neutral-900 dark:text-neutral-100',
			placeholder: 'placeholder-neutral-500 dark:placeholder-neutral-400',
			weight: 'font-medium',
		},
	},

	// Typography styles
	typography: {
		headings: {
			h1: 'text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50',
			h2: 'text-3xl font-bold text-neutral-900 dark:text-neutral-50',
			h3: 'text-2xl font-semibold text-neutral-900 dark:text-neutral-50',
			h4: 'text-xl font-semibold text-neutral-900 dark:text-neutral-50',
			h5: 'text-lg font-medium text-neutral-900 dark:text-neutral-50',
			h6: 'text-base font-medium text-neutral-900 dark:text-neutral-50',
		},
		body: {
			default: 'text-base text-neutral-700 dark:text-neutral-300',
			lg: 'text-lg text-neutral-700 dark:text-neutral-300',
			sm: 'text-sm text-neutral-700 dark:text-neutral-300',
			xs: 'text-xs text-neutral-700 dark:text-neutral-300',
		},
		special: {
			label: 'text-sm font-medium text-neutral-700 dark:text-neutral-300',
			caption: 'text-xs text-neutral-500 dark:text-neutral-400',
			error: 'text-sm text-error-600 dark:text-error-400',
			success: 'text-sm text-success-600 dark:text-success-400',
		},
	},

	// Layout styles
	layout: {
		grid: {
			base: 'grid',
			cols1: 'grid-cols-1',
			cols2: 'grid-cols-1 md:grid-cols-2',
			cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
			cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
			gap: {
				sm: 'gap-2',
				md: 'gap-4',
				lg: 'gap-6',
				xl: 'gap-8',
			},
		},
		flexRow: 'flex flex-row',
		flexCol: 'flex flex-col',
		center: 'flex items-center justify-center',
		between: 'flex items-center justify-between',
		end: 'flex items-center justify-end',
	},

	// Spacing values
	spacing: {
		section: 'py-12 md:py-16 lg:py-20',
		content: 'py-8 md:py-12',
		stackSm: 'space-y-2',
		stackMd: 'space-y-4',
		stackLg: 'space-y-6',
		inlineSm: 'space-x-2',
		inlineMd: 'space-x-4',
		inlineLg: 'space-x-6',
	},

	// Animation styles
	animation: {
		fadeIn: 'animate-fadeIn',
		scaleIn: 'animate-scaleIn',
		slideIn: 'animate-slideIn',
		transition: 'transition-all duration-300',
	},

	// Responsive styles
	responsive: {
		hidden: {
			mobile: 'hidden md:block',
			desktop: 'block md:hidden',
		},
		show: {
			mobile: 'block md:hidden',
			desktop: 'hidden md:block',
		},
	},

	// Accessibility
	a11y: {
		srOnly: 'sr-only',
		focusVisible: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
		contrast: 'text-neutral-900 dark:text-white', // High contrast text
	},
};

/**
 * Component Styles
 * Composition functions that generate consistent component styles
 */
export const styles = {
	// Button style composition
	button: (variant = 'primary', size = 'md', className = '') => {
		return cx(
			tokens.components.button.base,
			tokens.components.button.sizes[size],
			tokens.components.button.variants[variant],
			className
		);
	},

	// Input style composition
	input: (variant = 'default', size = 'md', hasError = false, className = '') => {
		return cx(
			tokens.components.input.base,
			tokens.components.input.variants[hasError ? 'error' : variant],
			tokens.components.input.sizes[size],
			tokens.components.input.text,
			tokens.components.input.placeholder,
			tokens.components.input.weight,
			className
		);
	},

	// Card style composition
	card: (variant = 'default', isInteractive = false, className = '') => {
		return cx(
			tokens.components.card.base,
			tokens.components.card.variants[variant],
			isInteractive && tokens.components.card.interactive,
			className
		);
	},

	// Container style composition
	container: (maxWidth = 'xl', className = '') => {
		return cx(
			tokens.components.container.base,
			tokens.components.container.max[maxWidth],
			className
		);
	},

	// Heading style composition
	heading: (level = 'h2', className = '') => {
		return cx(tokens.typography.headings[level], className);
	},

	// Body text style composition
	text: (size = 'default', className = '') => {
		return cx(tokens.typography.body[size], className);
	},
};

const designSystem = {
	tokens,
	styles,
};

export default designSystem;
