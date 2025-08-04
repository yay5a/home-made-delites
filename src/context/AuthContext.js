'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
	user: null,
	isAuthenticated: false,
	isLoading: true,
	error: null,
};

function authReducer(state, action) {
	switch (action.type) {
		case 'LOGIN_START':
			return { ...state, isLoading: true, error: null };
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};
		case 'LOGIN_FAILURE':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: action.payload,
			};
		case 'LOGOUT':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			};
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };
		case 'CLEAR_ERROR':
			return { ...state, error: null };
		default:
			return state;
	}
}

export function AuthProvider({ children }) {
	const [state, dispatch] = useReducer(authReducer, initialState);

	useEffect(() => {
		// Check for existing token on mount
		const token = localStorage.getItem('token');
		if (token) {
			// TODO: Validate token with server
			// For now, just set a mock user
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { id: 1, email: 'user@example.com', name: 'Demo User' },
			});
		} else {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, []);

	const login = async (email, password) => {
		dispatch({ type: 'LOGIN_START' });

		try {
			// TODO: Replace with actual API call
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (email === 'demo@example.com' && password === 'password') {
				const user = { id: 1, email, name: 'Demo User' };
				const token = 'mock-jwt-token';

				localStorage.setItem('token', token);
				dispatch({ type: 'LOGIN_SUCCESS', payload: user });
			} else {
				throw new Error('Invalid credentials');
			}
		} catch (error) {
			dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		dispatch({ type: 'LOGOUT' });
	};

	const clearError = () => {
		dispatch({ type: 'CLEAR_ERROR' });
	};

	const value = {
		...state,
		login,
		logout,
		clearError,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}
