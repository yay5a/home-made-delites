'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import RecipeAssistant from '@/components/assistant/RecipeAssistant';
import ApiQuotaStatus from '@/components/common/ApiQuotaStatus';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import UpgradePrompt from '@/components/subscription/UpgradePrompt';
import { useRouter } from 'next/navigation';

/**
 * Recipe Assistant Popup - A modal wrapper for the Recipe Assistant with subscription awareness
 */
export default function RecipeAssistantPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const { hasFeatureAccess } = useSubscription();
	const { isAuthenticated } = useAuth();
	const [showingPreview, setShowingPreview] = useState(false);
	const router = useRouter();

	const openAssistant = () => setIsOpen(true);
	const closeAssistant = () => setIsOpen(false);

	// Check if user has access to recipe assistant
	const hasAccess = hasFeatureAccess('recipeAssistant');

	// Start preview mode
	const startPreview = () => {
		setShowingPreview(true);
	};

	// Handle upgrade click
	const handleUpgradeClick = () => {
		closeAssistant();
		// Navigate to subscription page
		router.push('/subscription');
	};

	return (
		<>
			{/* Trigger Button */}
			<button
				onClick={openAssistant}
				className='fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 group'>
				<div className='flex items-center space-x-2'>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.828-.46l-5.829 1.389a.498.498 0 01-.616-.616l1.389-5.829A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z'
						/>
					</svg>
					<span className='hidden group-hover:block text-sm font-medium whitespace-nowrap'>
						Recipe Assistant
					</span>
				</div>
			</button>

			{/* Modal */}
			<Modal
				isOpen={isOpen}
				onClose={closeAssistant}
				title={
					hasAccess || showingPreview ? (
						<div className='flex items-center justify-between w-full'>
							<span>
								Recipe Assistant{' '}
								{showingPreview && (
									<span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2'>
										Preview
									</span>
								)}
							</span>
							<ApiQuotaStatus variant='minimal' />
						</div>
					) : (
						<div className='w-full'>
							<span>Recipe Assistant</span>
						</div>
					)
				}
				size='large'>
				<div className='h-96 flex flex-col'>
					<div className='flex-1 overflow-hidden'>
						{hasAccess ? (
							// Full access for subscribers
							<RecipeAssistant isPopup={true} />
						) : showingPreview ? (
							// Preview mode
							<RecipeAssistant
								isPopup={true}
								previewMode={true}
								onUpgradeClick={handleUpgradeClick}
							/>
						) : (
							// Upgrade prompt
							<UpgradePrompt
								feature='Recipe Assistant'
								description='Get personalized help with recipes, cooking techniques, and ingredient substitutions.'
								requiredPlan='premium'
								previewAvailable={isAuthenticated}
								onStartPreview={startPreview}
							/>
						)}
					</div>
				</div>
			</Modal>
		</>
	);
}
