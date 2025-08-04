import { forwardRef } from 'react';
import { formStyles, textStyles, spacingStyles, cx } from '@/styles/styleUtils';

const Input = forwardRef(
	({ label, error, type = 'text', placeholder, className = '', required = false, ...props }, ref) => {
		const inputClasses = cx(
			formStyles.input + ' dark:bg-gray-800 dark:text-gray-100',
			error ? formStyles.error : '',
			className
		);

		return (
			<div>
				{label && (
					<label className={formStyles.label + ' dark:text-gray-200'}>
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
				{error && <p className={cx(spacingStyles.mt1, textStyles.error)}>{error}</p>}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
