import Image from 'next/image';
import Link from 'next/link';
import RecipeLabels from '@/components/recipe/RecipeLabels';
import { PhotoIcon, ClockIcon, UserGroupIcon, FireIcon } from '@heroicons/react/24/outline';
import { layoutStyles, textStyles, spacingStyles, cx } from '@/styles/styleUtils';

export default function RecipeCard({ recipe }) {
	// Helper function to format servings display
	const formatServings = (servings) => {
		if (!servings) return 'N/A';

		if (typeof servings === 'number') {
			return `${servings} ${servings === 1 ? 'serving' : 'servings'}`;
		}

		return servings;
	};

	return (
		<div className={cx(layoutStyles.card, layoutStyles.cardHover)}>
			<div className='relative w-full h-48'>
				{recipe.image ? (
					<Image
						src={recipe.image}
						alt={recipe.title}
						fill
						className='object-cover'
						unoptimized={recipe.image.startsWith('http')} // Skip optimization for external URLs
					/>
				) : (
					<div className='flex items-center justify-center w-full h-full bg-gray-200'>
						<PhotoIcon className='w-12 h-12 text-gray-400' />
					</div>
				)}

				{/* Source label if available */}
				{recipe.source && (
					<span className='absolute bottom-0 right-0 px-2 py-1 text-xs text-white bg-black bg-opacity-60'>
						{recipe.source}
					</span>
				)}
			</div>

			<div className='p-6'>
				<h3 className={cx(textStyles.h3, spacingStyles.mb2, textStyles.lineClamp1)}>
					{recipe.title}
				</h3>
				<p className={cx(textStyles.bodySm, spacingStyles.mb2, textStyles.lineClamp2)}>
					{recipe.description}
				</p>

				{/* Diet, meal type & CO₂ labels */}
				<RecipeLabels
					labels={{
						dietLabels: recipe.dietLabels?.slice(0, 2) || [],
						mealType: recipe.mealType?.slice(0, 1) || [],
						co2EmissionsClass: recipe.co2EmissionsClass,
					}}
					className='gap-1 mb-3'
				/>

				<div className='flex items-center justify-between mb-4 text-sm text-gray-500'>
					{/* Show calories if available */}
					{recipe.calories > 0 ? (
						<span className='flex items-center'>
							<FireIcon className='w-4 h-4 mr-1' />
							{Math.round(recipe.calories)} cal
						</span>
					) : (
						<span className='flex items-center'>
							<ClockIcon className='w-4 h-4 mr-1' />
							{recipe.prepTime || 'N/A'}
						</span>
					)}

					<span className='flex items-center'>
						<UserGroupIcon className='w-4 h-4 mr-1' />
						{formatServings(recipe.servings)}
					</span>
				</div>

				<Link
					href={`/recipes/${recipe.id}`}
					className='inline-block w-full px-4 py-2 text-center text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700'>
					View Recipe
				</Link>
			</div>
		</div>
	);
}
