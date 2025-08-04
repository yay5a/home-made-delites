'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
	user: null,
	isAuthenticated: false,
	login: async () => {},
	logout: () => {},
	register: async () => {},
});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Check for stored auth token
		const token = localStorage.getItem('auth_token');
		if (token) {
			// For POC, just set as authenticated if token exists
			setIsAuthenticated(true);
			setUser({ id: 1 }); // Minimal user object for POC
		}
	}, []);

	const login = async (email, password) => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Login failed');
		}

		const { token } = await response.json();
		localStorage.setItem('auth_token', token);
		setIsAuthenticated(true);
		setUser({ email }); // We'll decode more user info from token later if needed
	};

	const register = async (email, password) => {
		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Registration failed');
		}

		const { token } = await response.json();
		localStorage.setItem('auth_token', token);
		setIsAuthenticated(true);
		setUser({ email });
	};
	const logout = () => {
		localStorage.removeItem('auth_token');
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}
