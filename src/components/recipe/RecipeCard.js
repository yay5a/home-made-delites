import Image from 'next/image';
import Link from 'next/link';

export default function RecipeCard({ recipe }) {
	return (
		<div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
			<div className='relative h-48 w-full'>
				{recipe.image ? (
					<Image
						src={recipe.image}
						alt={recipe.title}
						fill
						className='object-cover'
						unoptimized={recipe.image.startsWith('http')} // Skip optimization for external URLs
					/>
				) : (
					<div className='w-full h-full bg-gray-200 flex items-center justify-center'>
						<svg
							className='w-12 h-12 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
							/>
						</svg>
					</div>
				)}

				{/* Source label if available */}
				{recipe.source && (
					<span className='absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1'>
						{recipe.source}
					</span>
				)}
			</div>

			<div className='p-6'>
				<h3 className='text-xl font-semibold text-gray-900 mb-2 line-clamp-1'>{recipe.title}</h3>
				<p className='text-gray-600 text-sm mb-2 line-clamp-2'>{recipe.description}</p>

				{/* Diet labels */}
				{recipe.dietLabels && recipe.dietLabels.length > 0 && (
					<div className='mb-3 flex flex-wrap gap-1'>
						{recipe.dietLabels.slice(0, 2).map((label, index) => (
							<span
								key={index}
								className='bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full'>
								{label}
							</span>
						))}
					</div>
				)}

				<div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
					{/* Show calories if available */}
					{recipe.calories > 0 ? (
						<span className='flex items-center'>
							<svg
								className='w-4 h-4 mr-1'
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
							{Math.round(recipe.calories)} cal
						</span>
					) : (
						<span className='flex items-center'>
							<svg
								className='w-4 h-4 mr-1'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							{recipe.prepTime || 'N/A'}
						</span>
					)}

					<span className='flex items-center'>
						<svg
							className='w-4 h-4 mr-1'
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
						{recipe.servings || 'N/A'}{' '}
						{typeof recipe.servings === 'number'
							? recipe.servings === 1
								? 'serving'
								: 'servings'
							: ''}
					</span>
				</div>

				<Link
					href={`/recipes/${recipe.id}`}
					className='inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200'>
					View Recipe
				</Link>
			</div>
		</div>
	);
}
