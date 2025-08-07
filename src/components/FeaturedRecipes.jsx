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
      <div className="py-16 container mx-auto">
        <div className="animate-pulse bg-gray-200 h-64 rounded mb-4" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="py-16 text-center text-gray-500">
        No featured recipe available.
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold">Featured Recipe</h2>
      </div>
      <div className="container mx-auto">
        <RecipeCard recipe={recipe} />
      </div>
    </section>
  );
}
