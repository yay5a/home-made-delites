import { forwardRef } from 'react';
import { cx, styles } from '@/styles/styleUtils';

/**
 * Enhanced Input component with improved accessibility features
 * Addresses analysis issue #5: Accessibility gaps in components
 *
 * Features:
 * - ARIA attributes for screen readers
 * - High contrast styling
 * - Clear error handling
 * - Support for help text
 * - Required field indicators
 */
const AccessibleInput = forwardRef(
	(
		{
			id,
			label,
			error,
			type = 'text',
			placeholder,
			className = '',
			required = false,
			helpText,
			size = 'md',
			variant = 'default',
			...props
		},
		ref
	) => {
		// Generate unique IDs for accessibility
		const inputId =
			id ||
			`input-${label?.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 10000)}`;
		const helpTextId = helpText ? `${inputId}-help` : undefined;
		const errorId = error ? `${inputId}-error` : undefined;

		// Determine aria-describedby value
		const ariaDescribedBy = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;

		// Apply styles with our design system
		const inputClasses = cx(styles.input(error ? 'error' : variant, size), className);

		return (
			<div className='mb-4'>
				{/* Label with for attribute for accessibility */}
				{label && (
					<label
						htmlFor={inputId}
						className={cx(
							'block text-sm font-medium mb-1',
							'text-neutral-900 dark:text-neutral-100'
						)}>
						{label}
						{required && (
							<span className='text-error-600 dark:text-error-400 ml-1' aria-hidden='true'>
								*
							</span>
						)}
						{required && <span className='sr-only'> (required)</span>}
					</label>
				)}

				{/* Input with appropriate ARIA attributes */}
				<input
					ref={ref}
					id={inputId}
					type={type}
					placeholder={placeholder}
					className={inputClasses}
					aria-invalid={error ? 'true' : 'false'}
					aria-required={required}
					aria-describedby={ariaDescribedBy}
					required={required}
					{...props}
				/>

				{/* Help text for additional instructions */}
				{helpText && (
					<p id={helpTextId} className='mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
						{helpText}
					</p>
				)}

				{/* Error message with appropriate role for screen readers */}
				{error && (
					<p
						id={errorId}
						className='mt-1 text-sm text-error-600 dark:text-error-400'
						role='alert'>
						{error}
					</p>
				)}
			</div>
		);
	}
);

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput;
