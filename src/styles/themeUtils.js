import theme from '@/styles/theme';

/**
 * Utility to map theme color values to Tailwind classes
 * This helps ensure consistent color usage across the application
 */

// Color mapping for background classes
export function getBgClass(colorName, shade = 500) {
	if (!theme.colors[colorName]) {
		console.warn(`Color "${colorName}" not found in theme`);
		return '';
	}
	return `bg-${colorName}-${shade}`;
}

// Color mapping for text classes
export function getTextClass(colorName, shade = 500) {
	if (!theme.colors[colorName]) {
		console.warn(`Color "${colorName}" not found in theme`);
		return '';
	}
	return `text-${colorName}-${shade}`;
}

// Color mapping for border classes
export function getBorderClass(colorName, shade = 500) {
	if (!theme.colors[colorName]) {
		console.warn(`Color "${colorName}" not found in theme`);
		return '';
	}
	return `border-${colorName}-${shade}`;
}

/**
 * Maps theme colors to CSS variables for use in style objects
 * @param {string} colorName - The name of the color in the theme object
 * @param {number} shade - The shade of the color (e.g., 500)
 * @returns {string} - CSS variable string
 */
export function getThemeColor(colorName, shade = 500) {
	if (!theme.colors[colorName]?.[shade]) {
		console.warn(`Color "${colorName}-${shade}" not found in theme`);
		return '';
	}
	return theme.colors[colorName][shade];
}

/**
 * Get a complete object of all theme colors as CSS variables
 * Useful for style objects or CSS-in-JS
 */
export function getAllThemeColors() {
	const colorVars = {};

	Object.entries(theme.colors).forEach(([colorName, shades]) => {
		Object.entries(shades).forEach(([shade, value]) => {
			colorVars[`${colorName}${shade}`] = value;
		});
	});

	return colorVars;
}

// Generates a dynamic variant style object based on theme colors
export function createVariants(
	baseStyle,
	colorNames = ['primary', 'secondary', 'success', 'warning', 'danger']
) {
	const variants = {};

	colorNames.forEach((color) => {
		variants[color] = {
			...baseStyle,
			backgroundColor: getThemeColor(color),
			color:
				color === 'warning' || color === 'light' ? getThemeColor('secondary', 900) : '#ffffff',
			'&:hover': {
				backgroundColor: getThemeColor(color, 600),
			},
			'&:focus': {
				boxShadow: `0 0 0 3px ${getThemeColor(color, 200)}`,
			},
		};
	});

	return variants;
}
