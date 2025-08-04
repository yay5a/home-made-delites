'use client';

import { useState } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeList from '@/components/recipe/RecipeList';
import ApiStatusPage from '@/components/common/ApiStatusPage';

export default function RecipesPage() {
	const {
		recipes,
		loading,
		error,
		searchRecipes,
		totalResults,
		hasMore,
		loadMoreRecipes,
		searchQuery,
		shouldShowApiStatus,
		retryApiConnection,
	} = useRecipes();
	const [query, setQuery] = useState('');

	// If API has failed and we have no data, show the API status page
	if (shouldShowApiStatus) {
		return (
			<ApiStatusPage
				title='Unable to Load Recipes'
				message="We're experiencing issues loading recipes from our services."
				showUsageDetails={true}
			/>
		);
	}

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			searchRecipes(query);
		}
	};

	return (
		<div>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-gray-900'>Browse Recipes</h1>
				<p className='text-gray-900 mt-2'>
					{searchQuery
						? `Showing results for "${searchQuery}"`
						: 'Discover delicious recipes from our collection'}
				</p>
			</div>

			{/* Search Bar */}
			<div className='mb-8'>
				<form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-2'>
					<input
						type='text'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search recipes (e.g., chicken, vegetarian, pasta)'
						className='flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<button
						type='submit'
						className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
						Search
					</button>
				</form>
			</div>

			{/* Loading state */}
			{loading && recipes.length === 0 && (
				<div className='flex justify-center items-center py-12'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
				</div>
			)}

			{/* Error state */}
			{error && recipes.length === 0 && (
				<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
					<p>Error loading recipes: {error.message}</p>
				</div>
			)}

			{/* Results summary */}
			{!loading && recipes.length > 0 && (
				<div className='mb-6'>
					<p className='text-sm text-gray-500'>
						{totalResults > 0 ? `Found ${totalResults} recipes` : ''}
					</p>
				</div>
			)}

			{/* Recipe list */}
			<RecipeList recipes={recipes} />

			{/* Load more button */}
			{hasMore && (
				<div className='flex justify-center mt-8'>
					<button
						onClick={loadMoreRecipes}
						disabled={loading}
						className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg disabled:opacity-50'>
						{loading ? 'Loading...' : 'Load More Recipes'}
					</button>
				</div>
			)}

			{/* No results message */}
			{!loading && recipes.length === 0 && (
				<div className='text-center py-12'>
					<svg
						className='mx-auto h-12 w-12 text-gray-400'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					<h3 className='mt-2 text-sm font-medium text-gray-900'>No recipes found</h3>
					<p className='mt-1 text-sm text-gray-500'>Try searching for a different term.</p>
				</div>
			)}
		</div>
	);
}
