'use client';

import React, { useEffect } from 'react';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import RecipeCard from './RecipeCard';

const MAX_RESULTS = 5;

export default function SearchModal({ open, onClose, query }) {
  const { results, loading, errorMsg, search } = useRecipeSearch();

  // Run search when modal opens and query is non-empty
  useEffect(() => {
    if (!open) return;

    if (query.trim()) search(query);

    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, query, search, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={onClose} >
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-3xl w-full shadow-2xl relative space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-800">Search Results</h2>
          <button
            onClick={onClose}
            className="hover:text-gray-700 absolute top-4 right-6 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {loading && <div className="text-center py-8 text-lg text-gray-700">Searching…</div>}
        {errorMsg && <p className="text-red-500 text-center text-lg">{errorMsg}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto pr-2">
          {results.slice(0, MAX_RESULTS).map(r => (
            <RecipeCard key={r.uri} recipe={r} />
          ))}
        </div>
        {!loading && results.length === 0 && !errorMsg && (
          <div className="text-center text-gray-500 py-8 text-lg">No recipes found.</div>
        )}
      </div>
    </div>
  );
}
