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
        mealType   = [],
    } = recipe;

    const tags = [...cuisineType, ...dietLabels, ...mealType];
    const shown = tags.slice(0, 3);
    const extra = tags.length - shown.length;

    return (
        <>
            <article className="p-4 space-y-2 bg-amber-50 bg-[url('/images/paper-texture.svg')] bg-repeat border border-amber-200 rounded-lg shadow-[6px_6px_0_rgba(0,0,0,0.1)]">
                <Link
                    href={recipe.url}
                    className="py-4 text-center font-semibold focus:ring"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h3 className={`${patrick.className} text-2xl`}>{recipe.label}</h3>
                </Link>
                {recipe.image ? (
                        <Image
                            placeholder="blur"
                            blurDataURL={recipe.image + '?w=10&q=10'}
                            src={recipe.image}
                            alt={'Photo of ' + recipe.label}
                            width={300}
                            height={200}
                            className="object-contain mx-auto mb-4 rounded"
                        />
                ) : (
                        <div className="flex items-center justify-center">
                            <XMarkIcon className="w-12 h-12 " />
                        </div>
                    )}

                <div className="flex flex-wrap gap-2">
                    {shown.map((tag, i) => (
                        <span key={`${tag}-${i}`} className="text-xs px-2 py-0.5">{tag}</span>
                    ))}
                    {extra > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                            + {extra} more
                        </span>
                    )}
                </div>

                {recipe.calories > 0 && (
                    <div className="flex items-center text-sm">
                        <FireIcon className="w-5 h-5 mr-1 text-amber-400" />
                        <span className="block mb-2 text-xs">{Math.round(recipe.calories)} Cal</span>
                    </div>
                )}
            </article>
        </>
    );
}
