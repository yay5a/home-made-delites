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
    <article className="card overflow-hidden border rounded-lg shadow-sm">
      {image ? (
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
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
              className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {calories > 0 && (
          <div className="flex items-center text-gray-600 text-sm">
            <FireIcon className="w-5 h-5 mr-1 text-red-500" />
            <span>{Math.round(calories)} Cal</span>
          </div>
        )}

        <Link
          href={link}
          className="block mt-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </Link>
      </div>
    </article>
  );
}
