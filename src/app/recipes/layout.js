import RecipeList from '@/components/recipe/RecipeList';

export default function RecipesLayout({ children }) {
	return (
		<div className='flex min-h-screen bg-gray-50'>
			{/* Sidebar */}
			<div className='w-64 bg-white shadow-sm'>
				<div className='p-6'>
					<h2 className='text-lg font-semibold text-gray-900 mb-4'>Recipe Categories</h2>
					<nav className='space-y-2'>
						<a
							href='#'
							className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md'>
							All Recipes
						</a>
						<a
							href='#'
							className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md'>
							Appetizers
						</a>
						<a
							href='#'
							className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md'>
							Main Courses
						</a>
						<a
							href='#'
							className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md'>
							Desserts
						</a>
						<a
							href='#'
							className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md'>
							Drinks
						</a>
					</nav>
				</div>
			</div>

			{/* Main content */}
			<div className='flex-1 p-6'>{children}</div>
		</div>
	);
}
