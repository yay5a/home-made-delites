'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/recipe/RecipeCard';
import RecipeAssistantPopup from '@/components/assistant/RecipeAssistantPopup';
import ApiStatusPage from '@/components/common/ApiStatusPage';

export default function Home() {
	const { recipes, loading, shouldShowApiStatus, retryApiConnection } = useRecipes();
	const [featuredRecipes, setFeaturedRecipes] = useState([]);
	const [featuredLoading, setFeaturedLoading] = useState(true);

	// Get random featured recipes from both database and Edamam API
	useEffect(() => {
		const fetchFeaturedRecipes = async () => {
			try {
				setFeaturedLoading(true);

				// Try to get some recipes from our database first
				let dbRecipes = [];
				if (recipes && recipes.length > 0) {
					// Shuffle and take up to 2 recipes from database
					const shuffledDb = [...recipes].sort(() => 0.5 - Math.random());
					dbRecipes = shuffledDb.slice(0, 2);
				}

				// Fetch some popular recipes from Edamam API to complement
				try {
					const { fetchEdamamRecipes } = await import('@/utils/edamamUtils');
					const popularQueries = [
						'popular chicken recipes',
						'quick pasta',
						'healthy salad',
						'easy dessert',
						'comfort food',
					];

					// Pick a random query for variety
					const randomQuery =
						popularQueries[Math.floor(Math.random() * popularQueries.length)];
					const edamamData = await fetchEdamamRecipes(randomQuery, { limit: 6 });

					if (edamamData && edamamData.hits) {
						const { transformEdamamRecipe } = await import('@/utils/edamamUtils');
						const edamamRecipes = edamamData.hits
							.map((hit) => transformEdamamRecipe(hit))
							.filter((recipe) => recipe && recipe.title);

						// Combine database recipes with API recipes
						const combined = [...dbRecipes, ...edamamRecipes];

						// Shuffle and take 6 for featured section
						const shuffled = combined.sort(() => 0.5 - Math.random());
						setFeaturedRecipes(shuffled.slice(0, 6));
					} else {
						// Fallback to database recipes only
						setFeaturedRecipes(dbRecipes.slice(0, 6));
					}
				} catch (apiError) {
					console.warn(
						'Failed to fetch from Edamam API, using database recipes only:',
						apiError
					);
					// Fallback to database recipes only
					setFeaturedRecipes(dbRecipes.slice(0, 6));
				}
			} catch (error) {
				console.error('Error fetching featured recipes:', error);
				// Ultimate fallback to first few recipes
				setFeaturedRecipes(recipes?.slice(0, 6) || []);
			} finally {
				setFeaturedLoading(false);
			}
		};

		// Only fetch featured recipes when we have loaded the initial recipes
		if (!loading && !shouldShowApiStatus) {
			fetchFeaturedRecipes();
		}
	}, [recipes, loading, shouldShowApiStatus]);

	// If API has failed and we have no data, show the API status page
	if (shouldShowApiStatus) {
		return (
			<ApiStatusPage
				title='Recipe Service Unavailable'
				message="We're unable to load recipes right now. This could be due to API rate limits or service issues."
				showUsageDetails={true}
			/>
		);
	}

	// Function to refresh featured recipes
	const refreshFeaturedRecipes = async () => {
		setFeaturedLoading(true);

		try {
			const { fetchEdamamRecipes } = await import('@/utils/edamamUtils');
			const popularQueries = [
				'italian cuisine',
				'mexican food',
				'asian recipes',
				'vegetarian meals',
				'quick dinner',
				'breakfast ideas',
				'healthy lunch',
			];

			const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
			const edamamData = await fetchEdamamRecipes(randomQuery, { limit: 6 });

			if (edamamData && edamamData.hits) {
				const { transformEdamamRecipe } = await import('@/utils/edamamUtils');
				const edamamRecipes = edamamData.hits
					.map((hit) => transformEdamamRecipe(hit))
					.filter((recipe) => recipe && recipe.title);

				setFeaturedRecipes(edamamRecipes.slice(0, 6));
			}
		} catch (error) {
			console.error('Error refreshing featured recipes:', error);
		} finally {
			setFeaturedLoading(false);
		}
	};

	return (
		<div className='bg-gray-50'>
			{/* Hero Section */}
			<section className='bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='text-center'>
						<h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
							Welcome to <span className='text-blue-600'>Home Made Delites</span>
						</h1>
						<p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
							Discover, create, and share delicious homemade recipes with our community of
							passionate home cooks. From family classics to innovative creations, find
							your next favorite dish here.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Link
								href='/recipes'
								className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
								Browse Recipes
							</Link>
							<Link
								href='/login'
								className='border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'>
								Join Our Community
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Recipes Section */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>Featured Recipes</h2>
						<p className='text-lg text-gray-600 mb-4'>
							Discover a delicious mix of popular recipes from our community and around the
							world
						</p>
						<button
							onClick={refreshFeaturedRecipes}
							disabled={featuredLoading}
							className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
								/>
							</svg>
							{featuredLoading ? 'Finding new recipes...' : 'Discover new recipes'}
						</button>
					</div>

					{featuredLoading ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className='bg-white rounded-lg shadow-md overflow-hidden animate-pulse'>
									<div className='h-48 bg-gray-200'></div>
									<div className='p-6'>
										<div className='h-6 bg-gray-200 rounded mb-2'></div>
										<div className='h-4 bg-gray-200 rounded mb-4'></div>
										<div className='h-10 bg-gray-200 rounded'></div>
									</div>
								</div>
							))}
						</div>
					) : featuredRecipes.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{featuredRecipes.map((recipe, index) => (
								<RecipeCard key={recipe.id || recipe.uri || index} recipe={recipe} />
							))}
						</div>
					) : (
						<div className='text-center py-12'>
							<p className='text-gray-500 mb-4'>
								No featured recipes available at the moment.
							</p>
							<Link
								href='/recipes'
								className='text-blue-600 hover:text-blue-800 font-semibold'>
								Browse all recipes →
							</Link>
						</div>
					)}

					<div className='text-center mt-8'>
						<Link
							href='/recipes'
							className='inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors'>
							View All Recipes
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='bg-white py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>
							Why Choose Home Made Delites?
						</h2>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='text-center'>
							<div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
								<svg
									className='w-8 h-8 text-blue-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-2'>Curated Recipes</h3>
							<p className='text-gray-600'>
								Handpicked recipes from home cooks around the world, tested and loved by
								our community.
							</p>
						</div>

						<div className='text-center'>
							<div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
								<svg
									className='w-8 h-8 text-green-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-2'>
								Community Driven
							</h3>
							<p className='text-gray-600'>
								Share your own recipes and discover new favorites from fellow cooking
								enthusiasts.
							</p>
						</div>

						<div className='text-center'>
							<div className='bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
								<svg
									className='w-8 h-8 text-yellow-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-2'>Easy to Follow</h3>
							<p className='text-gray-600'>
								Step-by-step instructions with helpful tips to ensure your cooking
								success every time.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Recipe Assistant Popup */}
			<RecipeAssistantPopup />
		</div>
	);
}
