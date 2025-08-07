'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import SearchModal from '@/components/SearchModal';
import FeaturedRecipes from '@/components/FeaturedRecipes';

export default function Home() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            {/* Hero Section */}
            <section className="py-8 container mx-auto">
                    <h1 className="text-4xl font-extrabold">
                        Welcome to <span className="text-primary">Home Made Delites</span>
                    </h1>

                    <p className="mt-4 text-lg">
                        Discover, create, and share delicious homemade recipes with our community of passionate home cooks.
                    </p>
            </section>
            <hr />

            {/* Search Modal */}
            <section className="py-2">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button onClick={() => setShowSearchBar(v => !v)} className="btn btn-primary">
                        <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
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
            <section className="py-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link href="/login" className="btn btn-primary">
                        Join&nbsp;Our&nbsp;Community
                    </Link>
                </div>
                <div className="text-center mb-12 p-2">
                    <h2 className="text-3xl font-semibold">Why Choose Home Made Delites?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-8 flex flex-col items-center">
                        <div className="rounded-full bg-blue-100 p-4 mb-4"></div>
                        <p>Handpicked recipes from passionate home cooks.</p>
                    </div>
                    <div className="card p-8 flex flex-col items-center">
                        <div className="rounded-full bg-pink-100 p-4 mb-4"></div>
                        <p>Simple tools to save, share, and organize your favorites.</p>
                    </div>
                    <div className="card p-8 flex flex-col items-center">
                        <div className="rounded-full bg-green-100 p-4 mb-4"></div>
                        <p>Modern, responsive design for every device.</p>
                    </div>
                </div>
            </section>
        </>
    );
}

