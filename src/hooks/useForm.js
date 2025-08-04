'use client';

import { useState, useCallback } from 'react';

export function useForm(initialValues = {}, validate = null) {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = useCallback(
		(e) => {
			const { name, value, type, checked } = e.target;
			setValues((prev) => ({
				...prev,
				[name]: type === 'checkbox' ? checked : value,
			}));

			// Clear error when user starts typing
			if (errors[name]) {
				setErrors((prev) => ({
					...prev,
					[name]: '',
				}));
			}
		},
		[errors]
	);

	const handleSubmit = useCallback(
		async (onSubmit) => {
			return async (e) => {
				e.preventDefault();
				setIsSubmitting(true);

				try {
					// Run validation if provided
					if (validate) {
						const validationErrors = validate(values);
						if (Object.keys(validationErrors).length > 0) {
							setErrors(validationErrors);
							return;
						}
					}

					// Clear any existing errors
					setErrors({});

					// Call the submit handler
					await onSubmit(values);
				} catch (error) {
					// Handle submission errors
					if (error.validationErrors) {
						setErrors(error.validationErrors);
					} else {
						setErrors({ submit: error.message || 'An error occurred' });
					}
				} finally {
					setIsSubmitting(false);
				}
			};
		},
		[values, validate]
	);

	const reset = useCallback(() => {
		setValues(initialValues);
		setErrors({});
		setIsSubmitting(false);
	}, [initialValues]);

	const setFieldValue = useCallback((name, value) => {
		setValues((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const setFieldError = useCallback((name, error) => {
		setErrors((prev) => ({
			...prev,
			[name]: error,
		}));
	}, []);

	return {
		values,
		errors,
		isSubmitting,
		handleChange,
		handleSubmit,
		reset,
		setFieldValue,
		setFieldError,
	};
}
