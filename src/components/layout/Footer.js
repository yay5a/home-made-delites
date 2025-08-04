export default function Footer() {
	return (
		<footer className='bg-gray-800 text-white'>
			<div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='col-span-1 md:col-span-2'>
						<h3 className='text-lg font-semibold mb-4'>Home Made Delites</h3>
						<p className='text-gray-300 mb-4'>
							Discover and share delicious homemade recipes with our community of food
							lovers.
						</p>
						<div className='flex space-x-4'>
							<a href='#' className='text-gray-300 hover:text-white'>
								<span className='sr-only'>Facebook</span>
								<svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
									<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
								</svg>
							</a>
							<a href='#' className='text-gray-300 hover:text-white'>
								<span className='sr-only'>Instagram</span>
								<svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
									<path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986c6.618 0 11.986-5.368 11.986-11.986C24.003 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.804C4.967 14.382 4.771 13.597 4.771 12.754c0-.844.196-1.628.662-2.43.568-1.075 1.719-1.805 3.016-1.805 1.297 0 2.448.73 3.016 1.805.466.802.662 1.586.662 2.43 0 .843-.196 1.628-.662 2.43-.568 1.074-1.719 1.804-3.016 1.804zm7.138 0c-1.297 0-2.448-.73-3.016-1.804-.466-.802-.662-1.587-.662-2.43 0-.844.196-1.628.662-2.43.568-1.075 1.719-1.805 3.016-1.805 1.297 0 2.448.73 3.016 1.805.466.802.662 1.586.662 2.43 0 .843-.196 1.628-.662 2.43-.568 1.074-1.719 1.804-3.016 1.804z' />
								</svg>
							</a>
							<a href='#' className='text-gray-300 hover:text-white'>
								<span className='sr-only'>Twitter</span>
								<svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
									<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
								</svg>
							</a>
						</div>
					</div>

					<div>
						<h3 className='text-sm font-semibold mb-4 uppercase tracking-wider'>Recipes</h3>
						<ul className='space-y-2'>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Appetizers
								</a>
							</li>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Main Courses
								</a>
							</li>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Desserts
								</a>
							</li>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Drinks
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className='text-sm font-semibold mb-4 uppercase tracking-wider'>Support</h3>
						<ul className='space-y-2'>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Help Center
								</a>
							</li>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Contact Us
								</a>
							</li>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Privacy Policy
								</a>
							</li>
							<li>
								<a href='#' className='text-gray-300 hover:text-white'>
									Terms of Service
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-8 pt-8 border-t border-gray-700'>
					<p className='text-center text-gray-300'>
						© 2025 Home Made Delites. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
