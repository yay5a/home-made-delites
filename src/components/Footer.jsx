'use client'

import Link from 'next/link';
import { SiFacebook, SiInstagram, SiTwitter } from 'react-icons/si';

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
                            <SiFacebook className="h-6 w-6 text-gray-300 hover:text-white" />
                            <SiInstagram className="h-6 w-6 text-gray-300 hover:text-white" />
                            <SiTwitter className="h-6 w-6 text-gray-300 hover:text-white" />
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

