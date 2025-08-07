'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HeartIcon, BookmarkSquareIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/solid';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ subsets: ['latin'], weight: '400' });

import SearchModal from '@/components/SearchModal';
import FeaturedRecipes from '@/components/FeaturedRecipes';

export default function Home() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            {/* Hero Section */}
            <section className="relative py-20 container mx-auto text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/utensils.svg')] bg-cover bg-center opacity-5 pointer-events-none" aria-hidden="true"></div>
                    <h1 className={`${greatVibes.className} text-4xl md:text-5xl sunlight-glow relative z-10`}>
                        Bring the warmth of home made delights to your table.
                    </h1>

                    <p className="mt-4 text-lg relative z-10">
                        Discover, create, and share delicious homemade recipes with our community of passionate home cooks.
                    </p>
            </section>
            <hr />

            {/* Search Modal */}
            <section className="py-2">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button onClick={() => setShowSearchBar(v => !v)} className="btn btn-primary shadow-sm hover:shadow-md group">
                        <MagnifyingGlassIcon className="h-5 w-5 mr-2 group-hover:animate-[wiggle_0.3s_ease-in-out]" />
                        Search
                    </button>
                </div>
                {showSearchBar && (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setModalOpen(true);
                        }}
                        className="mt-4 flex gap-2 justify-center"
                    >
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search recipes..."
                            className="px-3 py-2 border rounded w-100"
                        />
                        <button type="submit" className="btn btn-primary">Go</button>
                    </form>
                )}
                <SearchModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    query={searchQuery}
                />
            </section>

            {/* Featured Recipe  Modal */}
            <section className="py-4">
                <FeaturedRecipes />
            </section>

            {/* HMD Features */}
            <section className="py-12 bg-orange-50">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link href="/login" className="btn btn-primary">
                        Join&nbsp;Our&nbsp;Community
                    </Link>
                </div>
                <div className="text-center mb-12 p-2">
                    <h2 className="text-3xl font-semibold">Why Choose Home Made Delites?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
                        <div className="rounded-full bg-red-200 p-4">
                            <HeartIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <p className="text-center">Handpicked recipes from passionate home cooks.</p>
                    </div>
                    <div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
                        <div className="rounded-full bg-green-200 p-4">
                            <BookmarkSquareIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-center">Simple tools to save, share, and organize your favorites.</p>
                    </div>
                    <div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
                        <div className="rounded-full bg-yellow-200 p-4">
                            <DevicePhoneMobileIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <p className="text-center">Modern, responsive design for every device.</p>
                    </div>
                </div>
            </section>
        </>
    );
}

