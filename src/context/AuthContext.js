import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		if (storedToken) {
			setToken(storedToken);
			fetchUser(storedToken);
		} else {
			setLoading(false);
		}
	}, []);

	const fetchUser = async (jwt) => {
		try {
			const res = await fetch('/api/me', {
				headers: { Authorization: `Bearer ${jwt}` }
			});
			if (res.ok) {
				const userData = await res.json();
				setUser(userData);
			} else {
				setUser(null);
				localStorage.removeItem('token');
				setToken(null);
			}
		} catch (err) {
			setUser(null);
			localStorage.removeItem('token');
			setToken(null);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email, password) => {
		setLoading(true);
		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			if (res.ok) {
				const { token: jwt, user: userData } = await res.json();
				localStorage.setItem('token', jwt);
				setToken(jwt);
				setUser(userData);
			} else {
				const error = await res.json();
				throw new Error(error.message || 'Login failed');
			}
		} finally {
			setLoading(false);
		}
	};

	const register = async (data) => {
		setLoading(true);
		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (res.ok) {
				const { token: jwt, user: userData } = await res.json();
				localStorage.setItem('token', jwt);
				setToken(jwt);
				setUser(userData);
			} else {
				const error = await res.json();
				throw new Error(error.message || 'Registration failed');
			}
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isAuthenticated: !!user,
				loading,
				login,
				register,
				logout
			}}>
			{children}
		</AuthContext.Provider>
	);
};
