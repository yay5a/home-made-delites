'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

/**
 * Upgrade prompt component shown when users need to upgrade their subscription
 * to access premium features
 */
export default function UpgradePrompt({
	feature,
	description,
	requiredPlan = 'premium',
	showPreview = false,
	onStartPreview = () => {},
	previewAvailable = false,
}) {
	const { isAuthenticated } = useAuth();

	return (
		<div className='bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center max-w-lg mx-auto'>
			<div className='bg-blue-100 text-blue-800 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
				<svg
					className='w-10 h-10'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M13 10V3L4 14h7v7l9-11h-7z'
					/>
				</svg>
			</div>

			<h3 className='text-xl font-bold text-gray-900 mb-2'>{feature}</h3>
			<p className='text-gray-600 mb-6'>{description}</p>

			<div className='bg-gray-50 p-4 rounded-lg mb-6'>
				<h4 className='font-medium text-gray-800 mb-2'>
					{isAuthenticated ? 'Upgrade Required' : 'Login & Subscribe Required'}
				</h4>
				<p className='text-sm text-gray-600 mb-2'>
					{isAuthenticated
						? `This feature requires a ${requiredPlan} subscription.`
						: 'Please login or create an account to access this feature.'}
				</p>

				{requiredPlan === 'premium' && (
					<div className='text-sm bg-yellow-50 text-yellow-800 p-2 rounded'>
						<span className='font-medium'>Premium Feature</span> - Unlock with a subscription
					</div>
				)}
			</div>

			<div className='space-y-3'>
				{isAuthenticated ? (
					<Link
						href='/subscription'
						className='block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors'>
						Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
					</Link>
				) : (
					<>
						<Link
							href='/login?redirect=/subscription'
							className='block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors'>
							Login to Continue
						</Link>
						<Link
							href='/login?register=true&redirect=/subscription'
							className='block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors'>
							Sign Up for an Account
						</Link>
					</>
				)}

				{previewAvailable && (
					<button
						onClick={onStartPreview}
						className='block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded transition-colors'>
						Try Limited Preview
					</button>
				)}
			</div>
		</div>
	);
}
