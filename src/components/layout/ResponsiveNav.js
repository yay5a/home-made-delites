'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { cx, styles } from '@/styles/styleUtils';

/**
 * ResponsiveNav - A mobile-friendly navigation component that shows a hamburger menu on small screens
 * Addresses the analysis issue #3: Missing responsive navigation on mobile
 */
export default function ResponsiveNav() {
	const [isOpen, setIsOpen] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isOpen && !event.target.closest('nav')) {
				setIsOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isOpen]);

	// Close menu when pressing escape
	useEffect(() => {
		const handleEscKey = (event) => {
			if (isOpen && event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscKey);
		return () => {
			document.removeEventListener('keydown', handleEscKey);
		};
	}, [isOpen]);

	// Prevent scrolling when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	// Navigation links based on authentication status
	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/recipes', label: 'Recipes' },
		isAuthenticated ? { href: '/profile', label: 'Profile' } : null,
		{ href: '/recipe-assistant', label: 'Recipe Assistant' },
	].filter(Boolean);

	return (
		<nav className='relative'>
			{/* Desktop Navigation */}
			<div className='hidden md:flex space-x-8'>
				{navLinks.map((link) => (
					<Link key={link.href} href={link.href} className={styles.button('ghost', 'md')}>
						{link.label}
					</Link>
				))}

				{isAuthenticated ? (
					<button onClick={logout} className={styles.button('danger', 'md')}>
						Logout
					</button>
				) : (
					<Link href='/login' className={styles.button('primary', 'md')}>
						Sign In
					</Link>
				)}
			</div>

			{/* Mobile Navigation Toggle */}
			<div className='md:hidden'>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={cx('flex items-center p-2 rounded-md', isOpen ? 'bg-neutral-100' : '')}
					aria-expanded={isOpen}
					aria-label='Toggle menu'>
					<span className='sr-only'>Open main menu</span>
					{/* Hamburger icon */}
					<svg
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						aria-hidden='true'>
						{isOpen ? (
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						) : (
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 6h16M4 12h16m-7 6h7'
							/>
						)}
					</svg>
				</button>
			</div>

			{/* Mobile Navigation Menu */}
			{isOpen && (
				<div
					className='absolute right-0 top-full mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 md:hidden z-50'
					role='menu'
					aria-orientation='vertical'>
					<div className='py-1 space-y-1' role='none'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-md'
								role='menuitem'
								onClick={() => setIsOpen(false)}>
								{link.label}
							</Link>
						))}

						{isAuthenticated ? (
							<button
								onClick={() => {
									logout();
									setIsOpen(false);
								}}
								className='block w-full text-left px-4 py-2 text-error-700 hover:bg-neutral-100 rounded-md'
								role='menuitem'>
								Logout
							</button>
						) : (
							<Link
								href='/login'
								className='block px-4 py-2 text-primary-700 hover:bg-neutral-100 rounded-md font-medium'
								role='menuitem'
								onClick={() => setIsOpen(false)}>
								Sign In
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
