'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { cx, styles } from '@/styles/designSystem';

/**
 * Main navigation component with responsive features
 */
export default function Nav() {
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
		<header className='bg-white dark:bg-dark-bg shadow-sm border-b border-neutral-200 dark:border-dark-border'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<div className='flex items-center'>
						<Link
							href='/'
							className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
							Home Made Delites
						</Link>
					</div>

					<nav className='relative'>
						{/* Desktop Navigation */}
						<div className='hidden space-x-8 md:flex'>
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={styles.button('ghost', 'md')}>
									{link.label}
								</Link>
							))}

							{isAuthenticated ? (
								<button onClick={logout} className={styles.button('danger', 'md')}>
									Logout
								</button>
							) : (
								<div className='flex space-x-4'>
									<Link href='/login' className={styles.button('secondary', 'md')}>
										Sign In
									</Link>
									<Link href='/register' className={styles.button('primary', 'md')}>
										Register
									</Link>
								</div>
							)}
						</div>

						{/* Mobile Navigation Toggle */}
						<div className='md:hidden'>
							<button
								onClick={() => setIsOpen(!isOpen)}
								className={cx(
									'flex items-center p-2 rounded-md',
									isOpen ? 'bg-neutral-100' : ''
								)}
								aria-expanded={isOpen}
								aria-label='Toggle menu'>
								<span className='sr-only'>Open main menu</span>
								{/* Hamburger icon */}
								<svg
									className='w-6 h-6'
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
								className='absolute right-0 z-50 w-56 p-2 mt-2 bg-white rounded-md shadow-lg top-full ring-1 ring-black ring-opacity-5 md:hidden'
								role='menu'
								aria-orientation='vertical'>
								<div className='py-1 space-y-1' role='none'>
									{navLinks.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className='block px-4 py-2 rounded-md text-neutral-700 hover:bg-neutral-100'
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
											className='block w-full px-4 py-2 text-left rounded-md text-error-700 hover:bg-neutral-100'
											role='menuitem'>
											Logout
										</button>
									) : (
										<>
											<Link
												href='/login'
												className='block px-4 py-2 font-medium rounded-md text-neutral-700 hover:bg-neutral-100'
												role='menuitem'
												onClick={() => setIsOpen(false)}>
												Sign In
											</Link>
											<Link
												href='/register'
												className='block px-4 py-2 font-medium rounded-md text-primary-700 hover:bg-neutral-100'
												role='menuitem'
												onClick={() => setIsOpen(false)}>
												Register
											</Link>
										</>
									)}
								</div>
							</div>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
