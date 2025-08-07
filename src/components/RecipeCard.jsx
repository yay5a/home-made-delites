'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RecipeCard({ recipe = {} }) {
  const {
    label: title = 'Not Available',
    image = '',
    cuisineType = [],
    dietLabels = [],
    mealType = [],
    calories = 0,
    url: link = '#'
  } = recipe;

  return (
    <article className="card">
      <Image
        src={image || '/logos/globe.svg'}
        alt={title}
        width={400}
        height={192}
        className="object-cover w-full h-48"
      />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {cuisineType.map((c, i) => (
            <span key={`cuisine-${i}`} className="text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
              {c}
            </span>
          ))}
          {dietLabels.map((d, i) => (
            <span key={`diet-${i}`} className="text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
              {d}
            </span>
          ))}
          {mealType.map((m, i) => (
            <span key={`meal-${i}`} className="text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
              {m}
            </span>
          ))}
        </div>

        {calories > 0 && (
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2 text-gray-500"
            >
              {/* icon path */}
            </svg>
            <span>{Math.round(calories)} Cal</span>
          </div>
        )}

        <Link href={link} className="inline-block text-blue-600 hover:underline text-sm font-medium">
          <h3 className="font-semibold">{title}</h3>
        </Link>
      </div>
    </article>
  );
}


