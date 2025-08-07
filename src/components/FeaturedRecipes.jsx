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
    <section className="py-16 bg-gradient-to-r from-amber-50 to-rose-100">
      <div className="container mx-auto text-center mb-8 px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-amber-800 mb-4">Featured Recipe</h2>
        <p className="text-lg text-gray-700 mb-2">Discover something delicious, handpicked for you!</p>
      </div>
      <div className="flex justify-center items-center px-4">
        <div className="w-full max-w-xl bg-amber-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <RecipeCard recipe={recipe} />
        </div>
      </div>
    </section>
  );
}
