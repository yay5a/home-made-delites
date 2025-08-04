'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Nav() {
	const { isAuthenticated } = useAuth();

	return (
		<nav className='bg-white shadow-sm'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex space-x-8'>
						<Link
							href='/'
							className='inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300'>
							Home
						</Link>
						<Link
							href='/recipes'
							className='inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'>
							Recipes
						</Link>
						{isAuthenticated && (
							<Link
								href='/profile'
								className='inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'>
								My Profile
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
