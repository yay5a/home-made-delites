'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
	const { user, isAuthenticated, logout } = useAuth();

	return (
		<header className='bg-white shadow-sm border-b border-gray-200'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<div className='flex items-center'>
						<Link href='/' className='text-2xl font-bold text-gray-900'>
							Home Made Delites
						</Link>
					</div>

					{/* Navigation */}
					<nav className='hidden md:flex space-x-8'>
						<Link
							href='/'
							className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'>
							Home
						</Link>
						<Link
							href='/recipes'
							className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'>
							Recipes
						</Link>
					</nav>

					{/* User menu */}
					<div className='flex items-center space-x-4'>
						{isAuthenticated ? (
							<>
								<Link
									href='/profile'
									className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'>
									Profile
								</Link>
								<button
									onClick={logout}
									className='bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700'>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									href='/login'
									className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-gray-400'>
									Login
								</Link>
								<Link
									href='/login?register=true'
									className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
