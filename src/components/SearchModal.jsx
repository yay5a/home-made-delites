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
    <div className="modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={onClose} >
      <div  onClick={(e) => e.stopPropagation()} className="modal-content bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full shadow-lg relative space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <button
            onClick={onClose}
            className="hover:text-gray-700 absolute top-2 right-2 text-3xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {loading && <div className="text-center py-8">Searching…</div>}
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
          {results.slice(0, MAX_RESULTS).map(r => (
            <RecipeCard key={r.uri} recipe={r} />
          ))}
        </div>
        {!loading && results.length === 0 && !errorMsg && (
          <div className="text-center text-gray-500 py-8">No recipes found.</div>
        )}
      </div>
    </div>
  );
}
