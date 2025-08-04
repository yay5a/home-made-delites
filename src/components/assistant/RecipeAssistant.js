'use client';

import { useState, useRef, useEffect } from 'react';
import { canUseAssistant, callAssistantApi, estimateTokens } from '@/utils/assistantUtils';
import ApiQuotaStatus from '@/components/common/ApiQuotaStatus';

/**
 * Recipe Assistant component with rate limit awareness and subscription support
 * Provides a chat interface for recipe questions with quota management
 */
export default function RecipeAssistant({
	isPopup = false,
	previewMode = false,
	onUpgradeClick = null,
}) {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [canUse, setCanUse] = useState(true);

	// Track message count for preview mode
	const [messageCount, setMessageCount] = useState(0);
	const MAX_PREVIEW_MESSAGES = 2; // Maximum messages in preview mode

	const messagesEndRef = useRef(null);

	// Scroll to bottom of messages when new ones are added (but not on initial load)
	useEffect(() => {
		// Only scroll if there are messages and we're not on initial load
		if (messages.length > 0) {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	// Check assistant availability on component mount
	useEffect(() => {
		checkAssistantAvailability('');
	}, []);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!input.trim() || isLoading || !canUse) return;

		// Check preview mode message limit
		if (previewMode && messageCount >= MAX_PREVIEW_MESSAGES) {
			setError('You have reached the maximum number of messages in preview mode.');

			// Show upgrade button if provided
			if (onUpgradeClick) {
				setMessages((prev) => [
					...prev,
					{
						role: 'system',
						content:
							'You have reached the preview message limit. Please upgrade to continue using the Recipe Assistant.',
						isUpgradePrompt: true,
					},
				]);
			}
			return;
		}

		const userMessage = input.trim();
		setInput('');

		// Check if we can use the assistant based on rate limits
		if (!(await checkAssistantAvailability(userMessage))) {
			return;
		}

		// Add user message to chat
		setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

		// Increment message count for preview mode
		if (previewMode) {
			setMessageCount((count) => count + 1);
		}

		// Show loading state
		setIsLoading(true);
		setError(null);

		try {
			// Call assistant API
			const response = await callAssistantApi('chat', {
				prompt: userMessage,
				messages: messages.filter((m) => m.role !== 'system'), // Exclude system messages
			});

			// Add assistant response to chat
			setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
		} catch (error) {
			console.error('Assistant error:', error);

			// Handle rate limit errors specifically
			if (error.message?.includes('limit exceeded')) {
				setError('You have reached your recipe assistant usage limit. Please try again later.');
				setCanUse(false);
			} else {
				setError('Sorry, there was an error getting a response. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Check if we can use the assistant based on rate limits
	const checkAssistantAvailability = async (prompt) => {
		try {
			const available = canUseAssistant(prompt);
			setCanUse(available);
			return available;
		} catch (error) {
			console.error('Error checking assistant availability:', error);
			setCanUse(false);
			return false;
		}
	};

	return (
		<div
			className={`flex flex-col h-full ${
				isPopup ? '' : 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden'
			}`}>
			{!isPopup && (
				<div className='p-4 border-b border-gray-200 flex justify-between items-center'>
					<h2 className='text-lg font-medium text-gray-900'>Recipe Assistant</h2>
					<ApiQuotaStatus variant='minimal' />
				</div>
			)}

			{/* Messages container */}
			<div className={`flex-1 overflow-y-auto p-4 bg-gray-50 ${isPopup ? 'h-80' : 'h-80'}`}>
				{messages.length === 0 && (
					<div className='text-center text-gray-500 py-8'>
						<div className='mb-4'>
							<svg
								className='w-12 h-12 mx-auto text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.828-.46l-5.829 1.389a.498.498 0 01-.616-.616l1.389-5.829A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z'
								/>
							</svg>
						</div>
						<p className='text-lg font-medium mb-2'>Welcome to Recipe Assistant!</p>
						<p>Ask me about recipes, cooking techniques, or ingredient substitutions.</p>
					</div>
				)}

				{messages.map((message, index) => (
					<div key={index} className={`mb-3 ${message.role === 'user' ? 'text-right' : ''}`}>
						<div
							className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
								message.role === 'system'
									? 'bg-blue-100 text-blue-800'
									: message.role === 'user'
									? 'bg-green-100 text-green-800'
									: 'bg-white border border-gray-200 text-gray-800 shadow-sm'
							}`}>
							{message.content}

							{/* Upgrade button for preview mode */}
							{message.isUpgradePrompt && onUpgradeClick && (
								<div className='mt-3'>
									<button
										onClick={onUpgradeClick}
										className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm'>
										Upgrade to Premium
									</button>
								</div>
							)}
						</div>
					</div>
				))}

				{/* Loading indicator */}
				{isLoading && (
					<div className='flex items-center mb-3'>
						<div className='bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm'>
							<div className='flex space-x-1 items-center'>
								<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
								<div
									className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
									style={{ animationDelay: '0.2s' }}></div>
								<div
									className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
									style={{ animationDelay: '0.4s' }}></div>
							</div>
						</div>
					</div>
				)}

				{/* Error message */}
				{error && (
					<div className='mb-3'>
						<div className='bg-red-100 text-red-800 rounded-lg px-4 py-2 max-w-[80%]'>
							{error}
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input form */}
			<form onSubmit={handleSubmit} className='p-4 border-t border-gray-200'>
				<div className='flex space-x-2'>
					<input
						type='text'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							canUse ? 'Ask about recipes, cooking techniques...' : 'Daily limit reached'
						}
						disabled={!canUse || isLoading}
						className='flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500'
					/>
					<button
						type='submit'
						disabled={!canUse || isLoading || !input.trim()}
						className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300'>
						Send
					</button>
				</div>

				{!canUse && (
					<div className='mt-2'>
						<ApiQuotaStatus variant='small' />
					</div>
				)}
			</form>
		</div>
	);
}
