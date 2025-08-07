import React, { createContext, useState, useEffect } from 'react';
import * as jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isTokenExpired = (token) => {
        try {
            const { exp } = jwtDecode(token);
            return exp < Date.now() / 1000 - 120;
        } catch {
            return true;
        }
    };

    const fetchUser = async (token) => {
        try {
            const res = await fetch('/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401) throw new Error('Session expired');
            if (!res.ok) throw new Error('Failed to fetch user');
            const userData = await res.json();
            setUser(userData);
            setError(null);
        } catch (err) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken || isTokenExpired(storedToken)) {
            localStorage.removeItem('token');
            setLoading(false);
            return;
        }
        setToken(storedToken);
        fetchUser(storedToken);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Login failed');
            }
            const { token: jwt, user: userData } = await res.json();
            localStorage.setItem('token', jwt);
            setToken(jwt);
            setUser(userData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                loading,
                error,
                login,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};
