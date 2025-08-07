'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon, FireIcon } from '@heroicons/react/24/solid';

export default function RecipeCard({ recipe = {} }) {
  const {
    label: title = 'Not Available',
    image,
    cuisineType = [],
    dietLabels = [],
    mealType = [],
    calories = 0,
    url: link = '#',
  } = recipe;

  return (
    <article className="card p-4 space-y-2">
      {image ? (
        <div className="mb-4">
          <Image
            src={image}
            alt={title}
            width={300}
            height={200}
            className="object-contain mx-auto mb-4 rounded"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100">
          <XMarkIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {[...cuisineType, ...dietLabels, ...mealType].map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="text-xs text-gray-700 px-2 py-0.5 block"
            >
              {tag}
            </span>
          ))}
        </div>

        {calories > 0 && (
          <div className="flex items-center text-gray-600 text-sm">
            <FireIcon className="w-5 h-5 mr-1 text-red-500" />
            <span className="block mb-2 text-xs text-slate-400">{Math.round(calories)} Cal</span>
          </div>
        )}

        <Link
          href={link}
          className="text-md font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-xl font-semibold">{title}</h3>
        </Link>
      </div>
    </article>
  );
}
