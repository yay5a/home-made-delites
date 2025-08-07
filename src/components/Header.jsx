'use client'

import Nav from '@/components/Nav';
import Link from 'next/link';

export default function Header() {

    return (

        <header className='bg-white shadow-sm border-b border-gray-200'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <Link href='/' className='text-2xl font-bold text-gray-900'>
                            Home Made Delites
                        </Link>
                    </div>

                    {/* Navigation */}
                    <Nav />
                </div>
            </div>
        </header>

    );

}
