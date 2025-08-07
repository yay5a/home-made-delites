'use client'

import Nav from '@/components/Nav';
import Link from 'next/link';

export default function Header() {

    return (

        <header className='shadow-sm border-b border-gray-200'>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* 2) Logo */}
                <Link href="/" className="text-2xl font-bold text-gray-900">
                    Home Made Delites
                </Link>

                {/* 3) Primary nav */}
                <Nav />
            </div>
        </header>

    );

}
