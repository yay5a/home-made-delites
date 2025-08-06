import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchRecipes } from '@/lib/edamamService'

export default function RecipeCard({ recipe }) {
    let fetchRecipes = recipe
    recipe = {
    uri: id,
    label: title,
    image,
    dietLabels = [],
    mealType = [],
    calories,
    url: link
  };

	return (
		<article className='overflow-hidden transition-shadow bg-white rounded-lg shadow hover:shadow-lg'>
			<Image src={image || '/logos/globe.svg'} alt={title} className='object-cover w-full h-48' />
			<div className='p-4 space-y-2 card'>
				{/* Labels */}
				<div className='flex flex-wrap gap-1 text-xs'>
					{/* Diet */}
					{dietLabels.map((dietLabels, index) => (
						<span key={`diet-${index}`} className='text-sm px-2 py-0.5 rounded-full'>
							{dietLabels}
						</span>
					))}
					{/* Meal */}
					{mealType.map((mealType, index) => (
						<span key={`diet-${index}`} className='text-sm px-2 py-0.5 rounded-full'>
							{mealType}
						</span>
					))}
				</div>
			</div>
			<div>
				{/* Calories */}
				{/* if available, otherwise default to icon*/}
				{recipe.calories ? (
					<span className='flex items-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='size-6'>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z'
							/>
						</svg>{' '}
						Calories
						{Math.round(recipe.calories)}
					</span>
				) : (
					<span className='flex items-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='size-6'>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z'
							/>
						</svg>{' '}
					</span>
				)}
			</div>

			{/* Title & Link */}
			<Link href={link} className='inline-block text-sm text-blue-600 hover:underline'>
				<h3>{title}</h3>
			</Link>
		</article>
	);
}
