'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import RecipeCard from './RecipeCard';

export default function SearchModal() {
	// const { user } = useContext(AuthContext);
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const { results, loading, errorMsg, clickLeft, serverLeft, search } = useRecipeSearch();

	function onSubmit(event) {
		event.preventDefault();
		if (!user) return 'Please login/register to search for recipes!';
		search(query);
	}

	return (
		<>
			<button onClick={() => setOpen(true)}>🔍 Search</button>
			{open && (
				<div className='modal'>
					<button onClick={() => setOpen(false)}>X</button>
					<form action=''>
						<input
							type='text'
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder='Search...'
						/>
						<button>{loading ? '...' : 'Go'}</button>
					</form>

					{}
					{}
					{}

					<div>
						{results.map((result) => (
							<RecipeCard key={result.id} recipe={result} />
						))}
					</div>
				</div>
			)}
		</>
	);
}
