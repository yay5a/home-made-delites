/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class', // Enable class-based dark mode
	theme: {
		extend: {
			colors: {
				// Primary brand colors
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
				},
				// Secondary/accent colors
				accent: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
				},
				// Neutral colors
				neutral: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
				},
				// Semantic colors
				success: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
				error: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
				},
				// Dark mode specific colors
				dark: {
					bg: '#121212',
					card: '#1e1e1e',
					border: '#2e2e2e',
					text: {
						primary: '#f3f4f6',
						secondary: '#9ca3af',
					},
				},
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
				mono: ['var(--font-geist-mono)', 'monospace'],
			},
			spacing: {
				// Consistent spacing scale
				'2xs': '0.125rem', // 2px
				xs: '0.25rem', // 4px
				sm: '0.5rem', // 8px
				md: '1rem', // 16px
				lg: '1.5rem', // 24px
				xl: '2rem', // 32px
				'2xl': '2.5rem', // 40px
				'3xl': '3rem', // 48px
			},
			borderRadius: {
				sm: '0.25rem', // 4px
				DEFAULT: '0.375rem', // 6px
				md: '0.5rem', // 8px
				lg: '0.75rem', // 12px
				xl: '1rem', // 16px
			},
			boxShadow: {
				sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			},
			animation: {
				fadeIn: 'fadeIn 0.3s ease-in-out',
				scaleIn: 'scaleIn 0.3s ease-in-out',
				slideIn: 'slideIn 0.3s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				slideIn: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ['dark', 'dark-hover'],
			textColor: ['dark', 'dark-hover'],
			borderColor: ['dark', 'dark-focus'],
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
	],
};
