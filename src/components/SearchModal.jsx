'use client';

import { useState } from 'react';
import RecipeCard from './RecipeCard';

export default function SearchModal() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);

	async function doSearch(query) {
		e.preventDefault();
		if (query.trim()) {
			searchRecipes(query);
		}
	}
}
