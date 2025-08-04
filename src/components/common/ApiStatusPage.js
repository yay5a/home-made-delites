'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ApiStatusPage({
	title = 'Service Temporarily Unavailable',
	message = "We're experiencing issues with our recipe service.",
	showUsageDetails = true,
}) {
	const [apiUsage, setApiUsage] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchApiUsage = async () => {
			try {
				const response = await fetch('/api/admin/api-usage');
				if (response.ok) {
					const data = await response.json();
					setApiUsage(data);
				}
			} catch (error) {
				console.error('Failed to fetch API usage:', error);
			} finally {
				setLoading(false);
			}
		};

		if (showUsageDetails) {
			fetchApiUsage();
		} else {
			setLoading(false);
		}
	}, [showUsageDetails]);

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='text-center'>
					{/* Error Icon */}
					<div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4'>
						<svg
							className='h-8 w-8 text-red-600'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
							/>
						</svg>
					</div>

					<h1 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h1>
					<p className='text-gray-600 mb-8'>{message}</p>
				</div>
			</div>

			<div className='sm:mx-auto sm:w-full sm:max-w-2xl'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					{showUsageDetails && (
						<>
							<h2 className='text-lg font-medium text-gray-900 mb-6'>
								API Status & Usage
							</h2>

							{loading ? (
								<div className='space-y-4'>
									{[1, 2, 3].map((i) => (
										<div key={i} className='animate-pulse'>
											<div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
											<div className='h-6 bg-gray-200 rounded w-1/2'></div>
										</div>
									))}
								</div>
							) : apiUsage ? (
								<div className='space-y-6'>
									{/* Current Usage Stats */}
									<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
										<div className='bg-blue-50 p-4 rounded-lg'>
											<div className='text-sm font-medium text-blue-600'>
												API Calls This Month
											</div>
											<div className='text-2xl font-bold text-blue-900'>
												{apiUsage.monthHits || 0}
											</div>
											<div className='text-xs text-blue-600'>
												Limit: {apiUsage.limits?.HITS_PER_MONTH || 'N/A'}
											</div>
										</div>

										<div className='bg-green-50 p-4 rounded-lg'>
											<div className='text-sm font-medium text-green-600'>
												Calls This Minute
											</div>
											<div className='text-2xl font-bold text-green-900'>
												{apiUsage.minuteHits || 0}
											</div>
											<div className='text-xs text-green-600'>
												Limit: {apiUsage.limits?.HITS_PER_MINUTE || 'N/A'}
											</div>
										</div>

										<div className='bg-purple-50 p-4 rounded-lg'>
											<div className='text-sm font-medium text-purple-600'>
												Assistant Calls Today
											</div>
											<div className='text-2xl font-bold text-purple-900'>
												{apiUsage.dayAssistantCalls || 0}
											</div>
											<div className='text-xs text-purple-600'>
												Limit:{' '}
												{apiUsage.limits?.ASSISTANT_CALLS_PER_DAY || 'N/A'}
											</div>
										</div>

										<div className='bg-orange-50 p-4 rounded-lg'>
											<div className='text-sm font-medium text-orange-600'>
												Assistant Tokens Today
											</div>
											<div className='text-2xl font-bold text-orange-900'>
												{apiUsage.dayAssistantTokens || 0}
											</div>
											<div className='text-xs text-orange-600'>
												Limit:{' '}
												{apiUsage.limits?.ASSISTANT_TOKENS_PER_DAY || 'N/A'}
											</div>
										</div>
									</div>

									{/* Status Information */}
									<div className='border-t pt-6'>
										<h3 className='text-sm font-medium text-gray-900 mb-3'>
											Possible Issues:
										</h3>
										<ul className='text-sm text-gray-600 space-y-2'>
											<li className='flex items-start'>
												<span className='w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0'></span>
												API rate limits have been exceeded
											</li>
											<li className='flex items-start'>
												<span className='w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0'></span>
												External recipe service is temporarily unavailable
											</li>
											<li className='flex items-start'>
												<span className='w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0'></span>
												Network connectivity issues
											</li>
										</ul>
									</div>

									{/* Retry Information */}
									<div className='border-t pt-6'>
										<h3 className='text-sm font-medium text-gray-900 mb-2'>
											What you can do:
										</h3>
										<ul className='text-sm text-gray-600 space-y-1'>
											<li>• Try refreshing the page in a few minutes</li>
											<li>• Check your internet connection</li>
											<li>• Browse our existing recipes in the database</li>
											<li>• Contact support if the issue persists</li>
										</ul>
									</div>
								</div>
							) : (
								<div className='text-center text-gray-500'>
									<p>Unable to fetch API usage details at this time.</p>
								</div>
							)}
						</>
					)}

					{/* Action Buttons */}
					<div className='mt-8 flex flex-col sm:flex-row gap-3'>
						<button
							onClick={() => window.location.reload()}
							className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors'>
							Try Again
						</button>

						<Link
							href='/recipes'
							className='flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center'>
							Browse Recipes
						</Link>

						<Link
							href='/'
							className='flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center'>
							Go Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
