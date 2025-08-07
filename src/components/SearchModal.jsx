'use client';

import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import RecipeCard from './RecipeCard';

export default function SearchModal() {
//  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { results, loading, errorMsg, search } = useRecipeSearch();

  function onSubmit(e) {
    e.preventDefault();
    if (!user) return;
    search(query);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        🔍 Search
      </button>

      {open && (
        <div className="modal-backdrop">
          <div className="modal-content space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Search Recipes</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 border border-gray-300 rounded-lg p-2"
              />
              <button type="submit" className="btn btn-primary">
                {loading ? '...' : 'Go'}
              </button>
            </form>

            {errorMsg && <p className="text-red-500">{errorMsg}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(r => (
                <RecipeCard key={r.uri} recipe={r} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


