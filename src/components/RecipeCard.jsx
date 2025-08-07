'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon, FireIcon } from '@heroicons/react/24/solid';
import { Patrick_Hand } from 'next/font/google';

const patrick = Patrick_Hand({ subsets: ['latin'], weight: '400' });

export default function RecipeCard({ recipe }) {
    if (!recipe) return null;
    const {
        cuisineType = [],
        dietLabels = [],
        mealType = [],
    } = recipe;

    const tags = [...cuisineType, ...dietLabels, ...mealType];
    const shown = tags.slice(0, 3);
    const extra = tags.length - shown.length;

    return (
        <>
            <article className="p-6 space-y-4 bg-amber-50 border border-amber-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Link
                    href={recipe.url}
                    className="block py-2 text-center font-bold text-amber-800 text-xl md:text-2xl tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-400 rounded transition-colors hover:text-amber-600 hover:bg-amber-100 active:text-amber-700"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="flex flex-col items-center">
                        <h3 className={`${patrick.className} text-2xl mb-2 flex items-center justify-center`} style={{ cursor: 'pointer' }}>
                            {recipe.label}
                        </h3>
                        <span className="block w-2/3 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 rounded-full mt-1"></span>
                    </div>
                </Link>
                {recipe.image ? (
                    <Image
                        placeholder="blur"
                        blurDataURL={recipe.image + '?w=10&q=10'}
                        src={recipe.image}
                        alt={'Photo of ' + recipe.label}
                        width={300}
                        height={200}
                        className="object-contain mx-auto mb-4 rounded-lg shadow"
                    />
                ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                        <XMarkIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                <div className="flex flex-wrap gap-2 justify-center">
                    {shown.map((tag, i) => (
                        <span key={`${tag}-${i}`} className="text-xs px-2 py-0.5 bg-amber-100 rounded-full text-amber-800 font-medium">{tag}</span>
                    ))}
                    {extra > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200">
                            + {extra} more
                        </span>
                    )}
                </div>

                {recipe.calories > 0 && (
                    <div className="flex items-center justify-center text-sm mt-2">
                        <FireIcon className="w-5 h-5 mr-1 text-amber-400" />
                        <span className="block text-xs text-gray-700">{Math.round(recipe.calories)} Cal</span>
                    </div>
                )}
            </article>
        </>
    );
}
