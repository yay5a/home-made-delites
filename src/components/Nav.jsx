'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
// TODO import { useContext } from 'react';
// TODO import { AuthContext } from '@/context/AuthContext';

const user = null; // TODO code useContext(AuthContext)

export default function Nav() {
	const [openMenu, setOpenMenu] = useState(false);
	const navItems = [
		{
			href: '/',
			label: 'Home',
		},
		{
			href: '/login',
			label: 'Login',
		},
		{
			href: '/register',
			label: 'Register',
		},
	];
	// prttier-ignore
	const authNavItems = user
		? [
				{
					href: '/dashboard',
					label: 'Dashboard',
				},
		  ]
		: [
				{
					href: '/register',
					label: 'Dashboard',
				},
		  ];

	return (
		<nav className='relative top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-black/[.08] dark:border-white/[.145]'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Nav Logo */}
					<Link href='/' className='hove:opacity-75 transition-opacity'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z'
							/>
						</svg>
					</Link>
					{/* Desktop Nav */}
					<div className='hidden md:flex space-x-8'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className='text-foreground hover:text-foreground/70 transition-colors font-medium'>
								{item.label}
							</Link>
						))}
					</div>

					{/* Mobile Buttons */}
					<button
						onClick={() => setOpenMenu(!openMenu)}
						className='md:hidden p-2 rounded-md text-foreground hover:bg-foreground/10 transition-colors'
						aria-label='Toggle menu'>
						<svg
							className='h-6 w-6'
							fill='none'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							{openMenu ? (
								<path d='M6 18L18 6M6 6l12 12' />
							) : (
								<path d='M4 6h16M4 12h16M4 18h16' />
							)}
						</svg>
					</button>
				</div>

				{/* Mobile Navigation */}
				{openMenu && (
					<div className='md:hidden py-4 border-t border-black/[.08] dark:border-white/[.145]'>
						<div className='flex flex-col space-y-3'>
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className='text-foreground hover:text-foreground/70 transition-colors font-medium py-2'
									onClick={() => setOpenMenu(false)}>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
