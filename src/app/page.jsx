import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchModal from '@/components/SearchModal';
import RecipeCard from '@/components/RecipeCard';


export default function Home() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="text-center">
						<h1>
							Welcome to <span className="text-blue-600">Home Made Delites</span>
						</h1>
						<p>
							Discover, create, and share delicious homemade recipes with our community of
							passionate home cooks. From family classics to innovative creations, find
							your next favorite dish here.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
							<Link
								href="/recipes"
								className="bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Browse Recipes
							</Link>
							<Link
								href="/login"
								className="border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
							>
								Join Our Community
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Search Modal */}
			<div className="flex justify-center ">
				<div className="w-full max-w-md">
					<SearchModal />
				</div>
			</div>

			{/* Featured Recipes Section */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2>Featured Recipes</h2>
						<p>
							Check out some of our most popular and loved recipes
						</p>
					</div>
                    <RecipeCard />
					<div className="text-center mt-8">
						<Link
							href="/recipes"
							className="inline-block bg-gray-900 px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
						>
							View All Recipes
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2>Why Choose Home Made Delites?</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-gray-100 rounded-xl shadow border border-gray-200 p-8 flex flex-col items-center">
							<div className="rounded-full bg-blue-100 p-4 mb-4">
								<svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15l4-4 4 4"/></svg>
							</div>
							<p>
								Handpicked recipes from passionate home cooks.
							</p>
						</div>
						<div className="bg-gray-100 rounded-xl shadow border border-gray-200 p-8 flex flex-col items-center">
							<div className="rounded-full bg-pink-100 p-4 mb-4">
								<svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-500" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>
							</div>
							<p>
								Simple tools to save, share, and organize your favorites.
							</p>
						</div>
						<div className="bg-gray-100 rounded-xl shadow border border-gray-200 p-8 flex flex-col items-center">
							<div className="rounded-full bg-green-100 p-4 mb-4">
								<svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500" viewBox="0 0 24 24"><path d="M9 17v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/><path d="M12 22v-4"/><circle cx="12" cy="7" r="2"/></svg>
							</div>
							<p>
								Modern, responsive design for every device.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
