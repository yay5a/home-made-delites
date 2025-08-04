'use client';

import { useState, useEffect } from 'react';
import { cx } from '@/styles/styleUtils';

/**
 * ThemeToggle - A user-controlled dark/light theme switcher
 * Addresses the analysis issue #4: Limited dark-mode control for users
 */
export default function ThemeToggle() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Initialize theme based on system preference and localStorage
	useEffect(() => {
		// Check for saved preference in localStorage
		const savedTheme = localStorage.getItem('color-theme');

		if (
			savedTheme === 'dark' ||
			(!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
			setIsDarkMode(true);
		} else {
			document.documentElement.classList.remove('dark');
			setIsDarkMode(false);
		}
	}, []);

	// Toggle theme function
	const toggleTheme = () => {
		if (isDarkMode) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('color-theme', 'light');
			setIsDarkMode(false);
		} else {
			document.documentElement.classList.add('dark');
			localStorage.setItem('color-theme', 'dark');
			setIsDarkMode(true);
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className={cx(
				'p-2 rounded-full transition-colors',
				'hover:bg-neutral-100 dark:hover:bg-neutral-800',
				'focus:outline-none focus:ring-2 focus:ring-primary-500',
				'text-neutral-700 dark:text-neutral-200'
			)}
			title={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
			aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
			<span className='sr-only'>
				{isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
			</span>

			{isDarkMode ? (
				// Sun icon for dark mode (to switch to light)
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'
					aria-hidden='true'>
					<path
						fillRule='evenodd'
						d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
						clipRule='evenodd'
					/>
				</svg>
			) : (
				// Moon icon for light mode (to switch to dark)
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'
					aria-hidden='true'>
					<path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
				</svg>
			)}
		</button>
	);
}
