'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Register page that redirects to login with register mode active
 * This allows us to maintain a single auth form while providing
 * dedicated URLs for login and registration
 */
export default function RegisterPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to login page with register parameter
		router.push('/login?register=true');
	}, [router]);

	// Show loading state while redirecting
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='text-center'>
				<h2 className='text-xl font-medium text-gray-900 dark:text-gray-100 mb-2'>
					Loading registration form...
				</h2>
				<p className='text-gray-500 dark:text-gray-400'>Please wait</p>
			</div>
		</div>
	);
}
