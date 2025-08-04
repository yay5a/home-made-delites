'use client';

import { useState } from 'react';
import ApiStatusPage from '@/components/common/ApiStatusPage';

export default function ApiTestPage() {
	const [showApiStatus, setShowApiStatus] = useState(false);

	if (showApiStatus) {
		return (
			<div>
				<div className='fixed top-4 right-4 z-50'>
					<button
						onClick={() => setShowApiStatus(false)}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
						← Back to Test
					</button>
				</div>
				<ApiStatusPage
					title='Test API Status Page'
					message='This is a demonstration of how the API status page looks when services are unavailable.'
					showUsageDetails={true}
				/>
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto py-12 px-4'>
			<h1 className='text-3xl font-bold text-gray-900 mb-8'>API Status Test Page</h1>

			<div className='bg-white p-6 rounded-lg shadow-md'>
				<h2 className='text-xl font-semibold mb-4'>Test API Failure Handling</h2>
				<p className='text-gray-600 mb-6'>
					Click the button below to see how the application handles API failures and displays
					usage details to users.
				</p>

				<button
					onClick={() => setShowApiStatus(true)}
					className='bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors'>
					🚨 Simulate API Failure
				</button>

				<div className='mt-6 p-4 bg-gray-50 rounded'>
					<h3 className='font-medium text-gray-900 mb-2'>What this demonstrates:</h3>
					<ul className='text-sm text-gray-600 space-y-1'>
						<li>• Professional error handling instead of fallback content</li>
						<li>• Real-time API usage statistics</li>
						<li>• Clear explanation of possible issues</li>
						<li>• Actionable steps for users</li>
						<li>• Retry functionality</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
