export default function RecipeDetailLoading() {
	return (
		<div className='animate-pulse'>
			<div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
			<div className='h-64 bg-gray-200 rounded mb-6'></div>
			<div className='space-y-4'>
				<div className='h-4 bg-gray-200 rounded w-full'></div>
				<div className='h-4 bg-gray-200 rounded w-5/6'></div>
				<div className='h-4 bg-gray-200 rounded w-4/6'></div>
			</div>
		</div>
	);
}
