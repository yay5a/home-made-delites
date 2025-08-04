'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const { user, logout, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push('/login');
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-3xl mx-auto'>
				<div className='bg-white shadow overflow-hidden sm:rounded-lg'>
					<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
						<div>
							<h3 className='text-lg leading-6 font-medium text-gray-900'>User Profile</h3>
							<p className='mt-1 max-w-2xl text-sm text-gray-500'>
								Personal details and preferences.
							</p>
						</div>
						<button
							onClick={logout}
							className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'>
							Logout
						</button>
					</div>
					<div className='border-t border-gray-200'>
						<dl>
							<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
								<dt className='text-sm font-medium text-gray-500'>Full name</dt>
								<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
									{user?.name || 'Not provided'}
								</dd>
							</div>
							<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
								<dt className='text-sm font-medium text-gray-500'>Email address</dt>
								<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
									{user?.email || 'Not provided'}
								</dd>
							</div>
							<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
								<dt className='text-sm font-medium text-gray-500'>Member since</dt>
								<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
									{user?.createdAt
										? new Date(user.createdAt).toLocaleDateString()
										: 'Unknown'}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
}
