import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes = [] }) {
	if (!recipes || recipes.length === 0) {
		return (
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
						d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
					/>
				</svg>
				<h3 className='mt-2 text-sm font-medium text-gray-900'>No recipes found</h3>
				<p className='mt-1 text-sm text-gray-500'>Get started by adding your first recipe.</p>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{recipes.map((recipe) => (
				<RecipeCard key={recipe.id} recipe={recipe} />
			))}
		</div>
	);
}
