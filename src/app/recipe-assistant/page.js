'use client';

import { useState } from 'react';
import RecipeAssistant from '@/components/assistant/RecipeAssistant';
import ApiQuotaStatus from '@/components/common/ApiQuotaStatus';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function RecipeAssistantPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const [showInfo, setShowInfo] = useState(false);

	// Check authentication
	if (!isLoading && !isAuthenticated) {
		redirect('/login');
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-5xl'>
			<div className='mb-8 text-center'>
				<h1 className='text-3xl font-bold text-gray-900'>Recipe Assistant</h1>
				<p className='mt-2 text-lg text-gray-600'>
					Get personalized help with recipes, cooking techniques, and ingredient substitutions
				</p>
			</div>

			{/* API Quota Status */}
			<div className='mb-6 max-w-md mx-auto'>
				<ApiQuotaStatus variant='detailed' />
			</div>

			{/* Recipe Assistant Component */}
			<div className='mb-8'>
				<RecipeAssistant />
			</div>

			{/* Information Section */}
			<div className='mt-12 bg-blue-50 rounded-lg p-6'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-xl font-semibold text-gray-900'>About Recipe Assistant</h2>
					<button
						onClick={() => setShowInfo(!showInfo)}
						className='text-blue-600 hover:text-blue-800'>
						{showInfo ? 'Show Less' : 'Show More'}
					</button>
				</div>

				<p className='text-gray-700'>
					Our Recipe Assistant is an AI-powered tool designed to help you with all your cooking
					needs. From finding the perfect substitution for an ingredient you don&apos;t have on
					hand to troubleshooting a recipe that isn&apos;t turning out right, our assistant is
					here to help.
				</p>

				{showInfo && (
					<div className='mt-4 space-y-4 text-gray-700'>
						<div>
							<h3 className='font-medium text-gray-900'>How it works:</h3>
							<p>
								Simply type your cooking question or request in the input box above and
								press &quot;Send&quot;. Our AI will analyze your question and provide
								helpful, relevant guidance based on culinary knowledge and techniques.
							</p>
						</div>

						<div>
							<h3 className='font-medium text-gray-900'>Usage limits:</h3>
							<p>
								To ensure the best experience for all users, we limit the number of
								assistant interactions per day. Your current usage and remaining quota
								are displayed at the top of this page. If you need additional assistance,
								please check back tomorrow when your quota resets.
							</p>
						</div>

						<div>
							<h3 className='font-medium text-gray-900'>Tips for best results:</h3>
							<ul className='list-disc pl-5 space-y-1'>
								<li>Be specific about your cooking question</li>
								<li>Mention any dietary restrictions or preferences</li>
								<li>Provide details about ingredients you have available</li>
								<li>Explain the problem you&apos;re trying to solve</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
