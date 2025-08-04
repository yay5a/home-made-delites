'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/mutations';
import { GET_USER_PROFILE } from '@/graphql/queries';
import { jwtDecode } from 'jwt-decode';

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

	// GraphQL mutations
	const [loginMutation] = useMutation(LOGIN_MUTATION, {
		onCompleted: (data) => {
			const { token, user } = data.login;
			localStorage.setItem('token', token);
			dispatch({ type: 'LOGIN_SUCCESS', payload: user });
		},
		onError: (error) => {
			dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
		},
	});

	const [registerMutation] = useMutation(REGISTER_MUTATION, {
		onCompleted: (data) => {
			const { token, user } = data.register;
			localStorage.setItem('token', token);
			dispatch({ type: 'LOGIN_SUCCESS', payload: user });
		},
		onError: (error) => {
			dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
		},
	});

	// Query for current user profile
	const { refetch: refetchProfile } = useQuery(GET_USER_PROFILE, {
		skip: true,
		onCompleted: (data) => {
			if (data.me) {
				dispatch({ type: 'LOGIN_SUCCESS', payload: data.me });
			}
		},
		onError: () => {
			// Token might be invalid, clear it
			localStorage.removeItem('token');
			dispatch({ type: 'SET_LOADING', payload: false });
		},
	});

	useEffect(() => {
		// Check for existing token on mount
		const token = localStorage.getItem('token');
		if (token) {
			try {
				// Decode token to check if it's expired
				const decoded = jwtDecode(token);
				const currentTime = Date.now() / 1000;

				if (decoded.exp > currentTime) {
					// Token is valid, fetch user profile
					refetchProfile();
				} else {
					// Token is expired
					localStorage.removeItem('token');
					dispatch({ type: 'SET_LOADING', payload: false });
				}
			} catch (error) {
				// Invalid token
				localStorage.removeItem('token');
				dispatch({ type: 'SET_LOADING', payload: false });
			}
		} else {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, [refetchProfile]);

	const login = async (email, password) => {
		dispatch({ type: 'LOGIN_START' });
		try {
			await loginMutation({ variables: { email, password } });
		} catch (error) {
			// Error is handled in onError callback
			throw error;
		}
	};

	const register = async (input) => {
		dispatch({ type: 'LOGIN_START' });
		try {
			await registerMutation({ variables: { input } });
		} catch (error) {
			// Error is handled in onError callback
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
		register,
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
