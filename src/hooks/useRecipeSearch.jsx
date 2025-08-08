'use client';

import { useState, useEffect, useRef } from 'react';
import fetchRecipes from '@/lib/edamamService';

const CLICK_LIMIT = 2;
const CLICK_COOLDOWN = 5_000;
const SERVER_COOLDOWN = 6_0000;
const CACHE_TTL = 5 * 6_0000;
const DEFAULT_LIMIT = 20;

export function useRecipeSearch() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const clickCount = useRef(0);
    const [clickCooldownEnds, setClickCooldownEnds] = useState(0);
    const [serverCooldownEnds, setServerCooldownEnds] = useState(0);

    const [clickLeft, setClickLeft] = useState(0);
    const [serverLeft, setServerLeft] = useState(0);

    useEffect(() => {
        const iv = setInterval(() => {
            const now = Date.now();
            setClickLeft(Math.max(0, Math.ceil((clickCooldownEnds - now) / 1000)));
            setServerLeft(Math.max(0, Math.ceil((serverCooldownEnds - now) / 1000)));
        }, 200);
        return () => clearInterval(iv);
    }, [clickCooldownEnds, serverCooldownEnds]);

    const cache = useRef(new Map());

    function getCached(q) {
        const hit = cache.current.get(q);
        if (!hit) return null;
        if (Date.now() - hit.ts > CACHE_TTL) {
            cache.current.delete(q);
            return null;
        }
        return hit.data;
    }

    function setCached(q, data) {
        cache.current.set(q, { ts: Date.now(), data });
    }


    /**
        * @param {string} query
        * @param {object} opts
        * @param {number} opts.limit - results cap
        */
    async function search(query, { limit = DEFAULT_LIMIT } = {}) {

        setErrorMsg('');
        const now = Date.now();
        if (now < serverCooldownEnds) {
            setErrorMsg(`Server locked—${serverLeft}s`);
            return;
        }

        if (now < clickCooldownEnds) return;

        clickCount.current += 1;

        if (clickCount.current > CLICK_LIMIT) {
            setClickCooldownEnds(now + CLICK_COOLDOWN);
            clickCount.current = 0;
            return;
        }

        const q = query.trim();

        if (!q) return;

        setLoading(true);

        const cached = getCached(q);

        if (cached) {
            setResults(cached);
            setLoading(false);
            return;
        }

        try {
            const data = await fetchRecipes(q, { limit });
            setResults(data.slice(0, limit));
            setCached(q, data);
        } catch (err) {
            if (err.code === 429) {
                setServerCooldownEnds(now + SERVER_COOLDOWN);
                setErrorMsg('Over limit—try again in 60s');
            } else {
                setErrorMsg('Search failed');
            }
        } finally {
            setLoading(false);
        }

    }

    function clear() {
        setResults([]);
        setErrorMsg('');
    }

    return {
        results,
        loading,
        errorMsg,
        clickLeft,
        serverLeft,
        search,
        clear
    };
}
