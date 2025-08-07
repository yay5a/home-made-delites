import React from 'react';
import Link from 'next/link';
import SearchModal from '@/components/SearchModal';
import FeaturedRecipes from '@/components/FeaturedRecipes';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container text-center">
          <h1 className="text-4xl font-extrabold">
            Welcome to <span className="text-primary">Home Made Delites</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover, create, and share delicious homemade recipes with our community of passionate home cooks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <SearchModal />  
            <Link href="/login" className="btn btn-primary">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <FeaturedRecipes />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold">Why Choose Home Made Delites?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-4 mb-4">
                {/* SVG icon */}
              </div>
              <p className="text-gray-700">Handpicked recipes from passionate home cooks.</p>
            </div>

            <div className="card p-8 flex flex-col items-center">
              <div className="rounded-full bg-pink-100 p-4 mb-4">
                {/* SVG icon */}
              </div>
              <p className="text-gray-700">Simple tools to save, share, and organize your favorites.</p>
            </div>

            <div className="card p-8 flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-4 mb-4">
                {/* SVG icon */}
              </div>
              <p className="text-gray-700">Modern, responsive design for every device.</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/login" className="btn btn-primary">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


