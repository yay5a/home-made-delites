'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRecipes } from '@/hooks/useRecipes';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RecipeDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { getRecipeById } = useRecipes();
	const [recipe, setRecipe] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				const foundRecipe = await getRecipeById(params.id);
				setRecipe(foundRecipe);
			} catch (error) {
				console.error('Error fetching recipe:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchRecipe();
	}, [params.id, getRecipeById]);

	if (loading) {
		return (
			<div className='flex justify-center items-center py-12'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	if (!recipe) {
		return (
			<div className='text-center py-12'>
				<h1 className='text-2xl font-bold text-gray-900 mb-4'>Recipe not found</h1>
				<p className='text-gray-600 mb-6'>
					The recipe you&apos;re looking for doesn&apos;t exist.
				</p>
				<button
					onClick={() => router.push('/recipes')}
					className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
					Browse Recipes
				</button>
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto'>
			<div className='mb-8'>
				<h1 className='text-4xl font-bold text-gray-900 mb-4'>{recipe.title}</h1>
				<p className='text-xl text-gray-600 mb-6'>{recipe.description}</p>

				{recipe.image && (
					<div className='relative h-96 w-full mb-8 rounded-lg overflow-hidden'>
						<Image
							src={recipe.image}
							alt={recipe.title}
							fill
							className='object-cover'
							unoptimized={recipe.image.startsWith('http')} // Skip optimization for external URLs
						/>
					</div>
				)}

				{/* Diet and Health Labels */}
				{(recipe.dietLabels?.length > 0 || recipe.healthLabels?.length > 0) && (
					<div className='mb-6'>
						<div className='flex flex-wrap gap-2'>
							{recipe.dietLabels?.map((label, index) => (
								<span
									key={`diet-${index}`}
									className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'>
									{label}
								</span>
							))}
							{recipe.healthLabels?.slice(0, 5).map((label, index) => (
								<span
									key={`health-${index}`}
									className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium'>
									{label}
								</span>
							))}
							{recipe.healthLabels?.length > 5 && (
								<span className='bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium'>
									+{recipe.healthLabels.length - 5} more
								</span>
							)}
						</div>
					</div>
				)}
			</div>

			<div className='grid md:grid-cols-2 gap-8'>
				<div>
					<h2 className='text-2xl font-semibold text-gray-900 mb-4'>Ingredients</h2>
					<ul className='space-y-2'>
						{recipe.ingredients?.map((ingredient, index) => (
							<li key={index} className='flex items-start'>
								<span className='w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2'></span>
								<span className='text-gray-700'>{ingredient}</span>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h2 className='text-2xl font-semibold text-gray-900 mb-4'>Instructions</h2>
					{recipe.instructions?.length > 0 ? (
						<ol className='space-y-4'>
							{recipe.instructions?.map((instruction, index) => (
								<li key={index} className='flex'>
									<span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-4 mt-0.5'>
										{index + 1}
									</span>
									<p className='text-gray-700'>{instruction}</p>
								</li>
							))}
						</ol>
					) : (
						<div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
							<p className='text-yellow-700'>
								For full cooking instructions, please visit the original recipe source:
							</p>
							{recipe.sourceUrl && (
								<div className='mt-4'>
									<a
										href={recipe.sourceUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='bg-blue-600 text-white px-4 py-2 rounded inline-block hover:bg-blue-700 transition-colors'>
										View Full Recipe on {recipe.source || 'Source Site'}
									</a>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Nutrition Facts */}
			{recipe.calories > 0 && (
				<div className='mt-8 border border-gray-200 rounded-lg overflow-hidden'>
					<div className='bg-gray-100 px-6 py-4 border-b border-gray-200'>
						<h2 className='text-xl font-bold text-gray-900'>Nutrition Facts</h2>
					</div>
					<div className='p-6'>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							<div>
								<p className='text-sm text-gray-500'>Calories</p>
								<p className='text-lg font-semibold'>
									{Math.round(recipe.calories) || 'N/A'}
								</p>
							</div>
							{recipe.nutrients?.PROCNT && (
								<div>
									<p className='text-sm text-gray-500'>Protein</p>
									<p className='text-lg font-semibold'>
										{Math.round(recipe.nutrients.PROCNT.quantity)}g
									</p>
								</div>
							)}
							{recipe.nutrients?.FAT && (
								<div>
									<p className='text-sm text-gray-500'>Fat</p>
									<p className='text-lg font-semibold'>
										{Math.round(recipe.nutrients.FAT.quantity)}g
									</p>
								</div>
							)}
							{recipe.nutrients?.CHOCDF && (
								<div>
									<p className='text-sm text-gray-500'>Carbs</p>
									<p className='text-lg font-semibold'>
										{Math.round(recipe.nutrients.CHOCDF.quantity)}g
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			<div className='mt-8 p-6 bg-gray-50 rounded-lg'>
				<div className='grid grid-cols-3 gap-4 text-center'>
					<div>
						<p className='text-sm text-gray-500'>Prep Time</p>
						<p className='text-lg font-semibold'>{recipe.prepTime || 'N/A'}</p>
					</div>
					<div>
						<p className='text-sm text-gray-500'>Cook Time</p>
						<p className='text-lg font-semibold'>{recipe.cookTime || 'N/A'}</p>
					</div>
					<div>
						<p className='text-sm text-gray-500'>Servings</p>
						<p className='text-lg font-semibold'>{recipe.servings || 'N/A'}</p>
					</div>
				</div>
			</div>

			{/* Back to recipes button */}
			<div className='mt-8 text-center'>
				<Link
					href='/recipes'
					className='inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg'>
					Back to Recipes
				</Link>
			</div>
		</div>
	);
}
