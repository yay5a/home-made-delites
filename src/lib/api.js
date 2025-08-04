const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiError extends Error {
	constructor(message, status, errors = null) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.errors = errors;
	}
}

export async function fetchGraphQL(query, variables = {}) {
	try {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

		const response = await fetch(`${API_BASE_URL}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(
				data.message || 'Network response was not ok',
				response.status,
				data.errors
			);
		}

		if (data.errors) {
			throw new ApiError(data.errors[0]?.message || 'GraphQL error occurred', 400, data.errors);
		}

		return data.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		// Handle network errors
		if (!navigator.onLine) {
			throw new ApiError('No internet connection', 0);
		}

		throw new ApiError(error.message || 'An unexpected error occurred', 500);
	}
}

export async function fetchREST(endpoint, options = {}) {
	try {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

		const config = {
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
			...options,
		};

		const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new ApiError(
				errorData.message || 'Network response was not ok',
				response.status,
				errorData.errors
			);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError(error.message || 'An unexpected error occurred', 500);
	}
}

export function handleApiError(error) {
	console.error('API Error:', error);

	if (error.status === 401) {
		// Handle unauthorized - redirect to login
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return 'Please log in to continue';
	}

	if (error.status === 403) {
		return 'You do not have permission to perform this action';
	}

	if (error.status === 404) {
		return 'The requested resource was not found';
	}

	if (error.status === 422) {
		return 'Please check your input and try again';
	}

	if (error.status === 500) {
		return 'A server error occurred. Please try again later';
	}

	return error.message || 'An unexpected error occurred';
}
