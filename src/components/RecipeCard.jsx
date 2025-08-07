'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon, FireIcon } from '@heroicons/react/24/solid';

export default function RecipeCard({ recipe }) {
    if (!recipe) return null;                     

    const tags = [
        ...(recipe.cuisineType ?? []),
        ...(recipe.dietLabels ?? []),
        ...(recipe.mealType   ?? [])
    ];

    return (
        <>
            <article className="card p-4 space-y-2">
                {recipe.image ? (
                    <div className="mb-4">
                        <Image
                            src={recipe.image}
                            alt={recipe.label}
                            width={300}
                            height={200}
                            className="object-contain mx-auto mb-4 rounded"
                        />
                    </div>
                ) : (
                        <div className="flex items-center justify-center">
                            <XMarkIcon className="w-12 h-12 " />
                        </div>
                    )}

                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span key={`${tag}-${i}`} className="text-xs px-2 py-0.5">
                                {tag}
                            </span>
                        ))}
                    </div>


                    {recipe.calories > 0 && (
                        <div className="flex items-center text-sm">
                            <FireIcon className="w-5 h-5 mr-1 text-red-500" />
                            <span className="block mb-2 text-xs">{Math.round(recipe.calories)} Cal</span>
                        </div>
                    )}

                    <Link
                        href={recipe.url}
                        className="text-md font-semibold"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h3 className="text-xl font-semibold">{recipe.label}</h3>
                    </Link>
                </div>
            </article>
        </>
    );
}
