import React from 'react';
import Link from 'next/link';
import SearchModal from '@/components/SearchModal';
import FeaturedRecipes from '@/components/FeaturedRecipes';

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-16">
                <h1 className="text-4xl font-extrabold">
                    Welcome to <span className="text-primary">Home Made Delites</span>
                </h1>
                <p className="mt-4 text-lg ">
                    Discover, create, and share delicious homemade recipes with our community of passionate home cooks.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <SearchModal />  
                    <Link href="/login" className="btn btn-primary">
                        Join Our Community
                    </Link>
                </div>
            </section>

            {/* Featured Recipes */}
            <section className="space-y-6">
                <FeaturedRecipes />
            </section>

            {/* HMD Features */}
            <section className="py-16 ">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold">Why Choose Home Made Delites?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-8 flex flex-col items-center">
                        <div className="rounded-full bg-blue-100 p-4 mb-4">
                            {/* SVG icon */}
                        </div>
                        <p>Handpicked recipes from passionate home cooks.</p>
                    </div>

                    <div className="card p-8 flex flex-col items-center">
                        <div className="rounded-full bg-pink-100 p-4 mb-4">
                            {/* SVG icon */}
                        </div>
                        <p>Simple tools to save, share, and organize your favorites.</p>
                    </div>

                    <div className="card p-8 flex flex-col items-center">
                        <div className="rounded-full bg-green-100 p-4 mb-4">
                            {/* SVG icon */}
                        </div>
                        <p>Modern, responsive design for every device.</p>
                    </div>
                </div>
            </section>
    </>
    );
}


