import React from 'react';

export default function RecipeLabels({ labels = {}, className = '' }) {
	const { dietLabels = [], healthLabels = [], mealType = [], co2EmissionsClass } = labels;

	const healthLimit = 5;

	return (
		<div className={`flex flex-wrap ${className}`}>
			{dietLabels.map((label, index) => (
				<span
					key={`diet-${index}`}
					className='bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full'>
					{label}
				</span>
			))}

			{mealType.map((type, index) => (
				<span
					key={`meal-${index}`}
					className='bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full'>
					{type}
				</span>
			))}

			{healthLabels.slice(0, healthLimit).map((label, index) => (
				<span
					key={`health-${index}`}
					className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>
					{label}
				</span>
			))}

			{healthLabels.length > healthLimit && (
				<span className='bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium'>
					+{healthLabels.length - healthLimit} more
				</span>
			)}

			{co2EmissionsClass && (
				<span
					className={`text-xs px-2 py-0.5 rounded-full ${
						co2EmissionsClass === 'A+' || co2EmissionsClass === 'A'
							? 'bg-green-100 text-green-800'
							: co2EmissionsClass === 'B' || co2EmissionsClass === 'C'
							? 'bg-yellow-100 text-yellow-800'
							: 'bg-red-100 text-red-800'
					}`}>
					CO₂ {co2EmissionsClass}
				</span>
			)}
		</div>
	);
}
