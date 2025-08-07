'use client'

import { SiFacebook } from 'react-icons/si';
import { SiInstagram } from 'react-icons/si';
import { SiX } from 'react-icons/si';
import Link from 'next/link';

export default function Footer() {

    return (

        <footer className='bg-gray-800 text-white'>
            <div className='container'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                    <div className='col-span-1 md:col-span-2'>
                        <h3 className='text-lg font-semibold mb-4'>Home Made Delites</h3>
                        <p className='text-gray-300 mb-4'>
                            Discover and share delicious homemade recipes with our community of food
                            lovers.
                        </p>
                        <div className="flex space-x-4 mb-4">
                            <Link href="https://facebook.com" aria-label="">

                                <SiFacebook className="h-6 w-6 text-gray-300 hover:text-white" />
                            </Link>
                            <Link href="https://instagram.com" aria-label="">
                                <SiInstagram className="h-6 w-6 text-gray-300 hover:text-white" />
                            </Link>
                            <Link href="https://x.com" aria-label="">

                                <SiX className="h-6 w-6 text-gray-300 hover:text-white" />
                            </Link>

                        </div>
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
