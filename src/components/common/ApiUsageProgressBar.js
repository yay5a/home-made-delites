'use client';

import { useState, useEffect } from 'react';
import { ApiUsageTracker } from '@/utils/apiUsageTracker';

/**
 * Component to display API usage progress as a progress bar
 * Shows current usage relative to limit with appropriate coloring
 */
export default function ApiUsageProgressBar({
	type = 'recipe',
	variant = 'small',
	showLabel = true,
	showRemainingCount = true,
}) {
	const [usage, setUsage] = useState({
		current: 0,
		limit: 100,
		percentage: 0,
	});

	// Get API usage data
	useEffect(() => {
		try {
			const apiTracker = new ApiUsageTracker();

			// Get usage based on type (recipe or assistant)
			const usageData =
				type === 'recipe' ? apiTracker.getRecipeApiUsage() : apiTracker.getAssistantApiUsage();

			setUsage({
				current: usageData.current,
				limit: usageData.limit,
				percentage: (usageData.current / usageData.limit) * 100,
			});
		} catch (error) {
			console.error('Error fetching API usage:', error);
			// Set default values on error
			setUsage({
				current: 0,
				limit: 100,
				percentage: 0,
			});
		}
	}, [type]);

	// Determine color based on usage percentage
	const getBarColor = (percentage) => {
		if (percentage > 90) return 'bg-red-500';
		if (percentage > 70) return 'bg-yellow-500';
		return 'bg-green-500';
	};

	// Format for compact display
	const formatNumber = (num) => {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num;
	};

	// Handle different variants
	const getHeightClass = () => {
		switch (variant) {
			case 'minimal':
				return 'h-1';
			case 'large':
				return 'h-4';
			default:
				return 'h-2.5';
		}
	};

	return (
		<div className='w-full'>
			{showLabel && (
				<div className='flex justify-between mb-1'>
					<span className='text-xs text-gray-600'>
						{type === 'recipe' ? 'Recipe API' : 'Assistant API'}
					</span>
					{showRemainingCount && (
						<span className='text-xs font-medium'>
							{formatNumber(usage.current)} / {formatNumber(usage.limit)}
						</span>
					)}
				</div>
			)}

			<div className='w-full bg-gray-200 rounded-full overflow-hidden'>
				<div
					className={`${getHeightClass()} ${getBarColor(
						usage.percentage
					)} rounded-full transition-all duration-300`}
					style={{ width: `${Math.min(100, usage.percentage)}%` }}></div>
			</div>
		</div>
	);
}
