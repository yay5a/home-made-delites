'use client';

import { useState, useEffect } from 'react';
import { getRemainingAssistantQuota, getAssistantQuotaMessage } from '@/utils/assistantUtils';

/**
 * Component to display API usage status for users
 * Shows remaining calls and tokens for recipe assistant
 */
export default function ApiQuotaStatus({ variant = 'small' }) {
	const [quota, setQuota] = useState({ remainingCalls: '?', remainingTokens: '?' });
	const [message, setMessage] = useState('');

	// Fetch current quota when component mounts
	useEffect(() => {
		try {
			const currentQuota = getRemainingAssistantQuota();
			setQuota(currentQuota);
			setMessage(getAssistantQuotaMessage());
		} catch (error) {
			console.error('Error loading API quota status:', error);
		}
	}, []);

	// Handle different display variants
	if (variant === 'minimal') {
		return (
			<div className='text-xs text-gray-500 dark:text-gray-400'>
				{quota.remainingCalls > 0
					? `${quota.remainingCalls} assistant calls remaining`
					: 'Daily assistant limit reached'}
			</div>
		);
	}

	if (variant === 'detailed') {
		return (
			<div className='bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
				<h3 className='font-medium text-gray-900 dark:text-gray-100 mb-1'>
					Recipe Assistant Status
				</h3>
				<div className='space-y-2'>
					<div className='flex justify-between text-sm'>
						<span className='text-gray-600 dark:text-gray-400'>Remaining Calls:</span>
						<span
							className={`font-medium ${
								quota.remainingCalls < 5
									? 'text-amber-600 dark:text-amber-400'
									: 'text-green-600 dark:text-green-400'
							}`}>
							{quota.remainingCalls}/{30}
						</span>
					</div>
					<div className='flex justify-between text-sm'>
						<span className='text-gray-600 dark:text-gray-400'>Remaining Tokens:</span>
						<span
							className={`font-medium ${
								quota.remainingTokens < 2000
									? 'text-amber-600 dark:text-amber-400'
									: 'text-green-600 dark:text-green-400'
							}`}>
							{quota.remainingTokens.toLocaleString()}/{(10000).toLocaleString()}
						</span>
					</div>
					<div className='text-xs text-gray-500 dark:text-gray-400 mt-2'>{message}</div>
				</div>
			</div>
		);
	}

	// Default 'small' variant
	return (
		<div className='text-sm flex items-center gap-1.5 text-gray-600 dark:text-gray-400'>
			<div
				className={`w-2 h-2 rounded-full ${
					quota.remainingCalls <= 0
						? 'bg-red-500'
						: quota.remainingCalls < 5
						? 'bg-amber-500'
						: 'bg-green-500'
				}`}></div>
			<span title={message}>{message}</span>
		</div>
	);
}
