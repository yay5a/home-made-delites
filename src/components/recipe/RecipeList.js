import RecipeCard from '@/components/recipe/RecipeCard';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function RecipeList({ recipes = [] }) {
	if (!recipes || recipes.length === 0) {
		return (
			<div className='py-12 text-center'>
				<ExclamationTriangleIcon className='w-12 h-12 mx-auto text-gray-400' />
				<h3 className='mt-2 text-sm font-medium text-gray-900'>No recipes found</h3>
				<p className='mt-1 text-sm text-gray-500'>Get started by adding your first recipe.</p>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{recipes.map((recipe) => (
				<RecipeCard key={recipe.id} recipe={recipe} />
			))}
		</div>
	);
}
