'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import apiUsageToday from '@/mock/api-usage-today.json';
import apiUsageWeek from '@/mock/api-usage-week.json';
import apiUsageMonth from '@/mock/api-usage-month.json';

const mockDataMap = {
	today: apiUsageToday,
	week: apiUsageWeek,
	month: apiUsageMonth,
};

export default function ApiUsageDashboard() {
	const { isAuthenticated, isLoading, user } = useAuth();
	const [usageData, setUsageData] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [timeframe, setTimeframe] = useState('today');
	const [loadingStats, setLoadingStats] = useState(true);

	// Check authentication and admin status
	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				redirect('/login');
			} else if (user?.role !== 'admin') {
				// Redirect non-admin users
				redirect('/');
			} else {
				setIsAdmin(true);
				fetchUsageData(timeframe);
			}
		}
	}, [isAuthenticated, isLoading, user, timeframe]);

	// Fetch API usage statistics
	const fetchUsageData = async (period) => {
		setLoadingStats(true);

		try {
			// In a real application, this would call an API endpoint
			// For now, we'll simulate the data

			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 800));

			const data = mockDataMap[period];
			setUsageData(data || { error: 'Invalid timeframe' });
		} catch (error) {
			console.error('Failed to fetch API usage data:', error);
		} finally {
			setLoadingStats(false);
		}
	};

	// If still loading auth status or not admin, show loading state
	if (isLoading || !isAdmin) {
		return (
			<div className='flex justify-center items-center min-h-[500px]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>API Usage Dashboard</h1>

			{/* Time period selector */}
			<div className='bg-white rounded-lg shadow-md p-4 mb-6'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-medium'>Select Time Period</h2>
					<div className='flex space-x-2'>
						<button
							onClick={() => setTimeframe('today')}
							className={`px-4 py-2 rounded-md text-sm font-medium ${
								timeframe === 'today'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
							}`}>
							Today
						</button>
						<button
							onClick={() => setTimeframe('week')}
							className={`px-4 py-2 rounded-md text-sm font-medium ${
								timeframe === 'week'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
							}`}>
							This Week
						</button>
						<button
							onClick={() => setTimeframe('month')}
							className={`px-4 py-2 rounded-md text-sm font-medium ${
								timeframe === 'month'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
							}`}>
							This Month
						</button>
					</div>
				</div>
			</div>

			{loadingStats ? (
				<div className='flex justify-center items-center min-h-[300px]'>
					<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500'></div>
				</div>
			) : usageData ? (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Recipe API Usage Card */}
					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='p-4 border-b border-gray-200'>
							<h2 className='text-lg font-medium'>Recipe API Usage</h2>
						</div>
						<div className='p-4'>
							<div className='mb-4'>
								<div className='flex justify-between mb-1'>
									<span className='text-sm text-gray-600'>API Calls</span>
									<span className='text-sm font-medium'>
										{usageData.recipeApiCalls.total} /{' '}
										{usageData.recipeApiCalls.limit}
									</span>
								</div>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className={`h-2.5 rounded-full ${
											usageData.recipeApiCalls.total /
												usageData.recipeApiCalls.limit >
											0.9
												? 'bg-red-500'
												: usageData.recipeApiCalls.total /
														usageData.recipeApiCalls.limit >
												  0.7
												? 'bg-yellow-500'
												: 'bg-green-500'
										}`}
										style={{
											width: `${Math.min(
												100,
												(usageData.recipeApiCalls.total /
													usageData.recipeApiCalls.limit) *
													100
											)}%`,
										}}
									/>
								</div>
							</div>

							<h3 className='text-sm font-medium text-gray-700 mb-2'>By Endpoint</h3>
							<div className='space-y-2'>
								<div className='flex justify-between text-xs'>
									<span>Search</span>
									<span>{usageData.recipeApiCalls.byEndpoint.search} calls</span>
								</div>
								<div className='flex justify-between text-xs'>
									<span>Get By ID</span>
									<span>{usageData.recipeApiCalls.byEndpoint.getById} calls</span>
								</div>
							</div>

							{usageData.recipeApiCalls.byDay && (
								<div className='mt-4'>
									<h3 className='text-sm font-medium text-gray-700 mb-2'>
										Daily Breakdown
									</h3>
									<div className='h-24 flex items-end justify-between gap-1'>
										{usageData.recipeApiCalls.byDay.map((count, i) => (
											<div key={i} className='flex flex-col items-center'>
												<div
													className='w-8 bg-blue-500'
													style={{
														height: `${Math.max(
															10,
															(count /
																Math.max(
																	...usageData.recipeApiCalls.byDay
																)) *
																100
														)}%`,
													}}
												/>
												<span className='text-xs mt-1'>Day {i + 1}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Assistant API Usage Card */}
					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='p-4 border-b border-gray-200'>
							<h2 className='text-lg font-medium'>Assistant API Usage</h2>
						</div>
						<div className='p-4'>
							<div className='mb-4'>
								<div className='flex justify-between mb-1'>
									<span className='text-sm text-gray-600'>API Calls</span>
									<span className='text-sm font-medium'>
										{usageData.assistantApiCalls.total} /{' '}
										{usageData.assistantApiCalls.limit}
									</span>
								</div>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className={`h-2.5 rounded-full ${
											usageData.assistantApiCalls.total /
												usageData.assistantApiCalls.limit >
											0.9
												? 'bg-red-500'
												: usageData.assistantApiCalls.total /
														usageData.assistantApiCalls.limit >
												  0.7
												? 'bg-yellow-500'
												: 'bg-green-500'
										}`}
										style={{
											width: `${Math.min(
												100,
												(usageData.assistantApiCalls.total /
													usageData.assistantApiCalls.limit) *
													100
											)}%`,
										}}
									/>
								</div>
							</div>

							<div className='mb-4'>
								<div className='flex justify-between mb-1'>
									<span className='text-sm text-gray-600'>Token Usage</span>
									<span className='text-sm font-medium'>
										{usageData.assistantApiCalls.totalTokens.toLocaleString()} /{' '}
										{usageData.assistantApiCalls.tokenLimit.toLocaleString()}
									</span>
								</div>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className={`h-2.5 rounded-full ${
											usageData.assistantApiCalls.totalTokens /
												usageData.assistantApiCalls.tokenLimit >
											0.9
												? 'bg-red-500'
												: usageData.assistantApiCalls.totalTokens /
														usageData.assistantApiCalls.tokenLimit >
												  0.7
												? 'bg-yellow-500'
												: 'bg-green-500'
										}`}
										style={{
											width: `${Math.min(
												100,
												(usageData.assistantApiCalls.totalTokens /
													usageData.assistantApiCalls.tokenLimit) *
													100
											)}%`,
										}}
									/>
								</div>
							</div>

							{usageData.assistantApiCalls.byDay && (
								<div className='mt-4'>
									<h3 className='text-sm font-medium text-gray-700 mb-2'>
										Daily Breakdown
									</h3>
									<div className='h-24 flex items-end justify-between gap-1'>
										{usageData.assistantApiCalls.byDay.map((count, i) => (
											<div key={i} className='flex flex-col items-center'>
												<div
													className='w-8 bg-purple-500'
													style={{
														height: `${Math.max(
															10,
															(count /
																Math.max(
																	...usageData.assistantApiCalls.byDay
																)) *
																100
														)}%`,
													}}
												/>
												<span className='text-xs mt-1'>Day {i + 1}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Summary Statistics */}
					<div className='bg-white rounded-lg shadow-md p-4 md:col-span-2'>
						<h2 className='text-lg font-medium mb-4'>Summary Statistics</h2>

						<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
							<div className='bg-blue-50 rounded-lg p-4'>
								<h3 className='text-sm text-gray-600 mb-1'>Unique Users</h3>
								<p className='text-2xl font-bold text-blue-700'>
									{usageData.uniqueUsers}
								</p>
							</div>

							<div className='bg-green-50 rounded-lg p-4'>
								<h3 className='text-sm text-gray-600 mb-1'>Cache Hit Rate</h3>
								<p className='text-2xl font-bold text-green-700'>76%</p>
							</div>

							<div className='bg-purple-50 rounded-lg p-4'>
								<h3 className='text-sm text-gray-600 mb-1'>Peak Usage</h3>
								<p className='text-2xl font-bold text-purple-700'>
									{timeframe === 'today'
										? usageData.peakHour
										: timeframe === 'week'
										? usageData.peakDay
										: usageData.peakWeek}
								</p>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='bg-red-100 text-red-700 p-4 rounded-lg'>
					Failed to load API usage statistics.
				</div>
			)}
		</div>
	);
}
