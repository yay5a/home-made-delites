import { forwardRef } from 'react';

const Input = forwardRef(
	({ label, error, type = 'text', placeholder, className = '', required = false, ...props }, ref) => {
		const inputClasses = `
    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `.trim();

		return (
			<div>
				{label && (
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						{label}
						{required && <span className='text-red-500 ml-1'>*</span>}
					</label>
				)}
				<input
					ref={ref}
					type={type}
					placeholder={placeholder}
					className={inputClasses}
					{...props}
				/>
				{error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
