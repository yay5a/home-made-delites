'use client';

import React, { useEffect, useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import fetchRecipes from '@/lib/edamamService';

export default function FeaturedRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchRecipes('random');
        const pick = all[Math.floor(Math.random() * all.length)];
        setRecipe(pick);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <div className="animate-pulse bg-amber-100 h-64 w-full max-w-xl rounded-lg shadow-lg" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="py-16 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
          No featured recipe available.
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 to-rose-100 flex justify-center items-center">
      <div className="w-full max-w-xl bg-white bg-opacity-80 rounded-2xl shadow-2xl p-8 border-4 border-amber-100 relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <span className="inline-block bg-gradient-to-r from-amber-400 to-rose-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">Featured</span>
        </div>
        <RecipeCard recipe={recipe} />
      </div>
    </section>
  );
}
