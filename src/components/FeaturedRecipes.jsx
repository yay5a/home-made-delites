'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import fetchRecipes from '@/lib/edamamService';
import RecipeCard from '@/components/RecipeCard';

export default function FeaturedRecipes() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    (async () => {
      const results = await fetchRecipes('random');
      const random = results[Math.floor(Math.random() * results.length)];
      setFeatured(random);
    })();
  }, []);

  if (!featured) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold">Featured Recipes</h2>
        </div>

        <div className="flex justify-center">
          <RecipeCard recipe={featured} />
        </div>

        <div className="text-center mt-8">
          <Link href="/recipes" className="btn btn-primary">
            View All Recipes
          </Link>
        </div>
      </div>
    </section>
  );
}


