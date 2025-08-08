'use client';

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [token, setToken] = useState(null);

    const isTokenExpired = (token) => {
        try {
            const { exp } = jwtDecode(token);
            return exp < Date.now() / 1000;
        } catch {
            return true;
        }
    };

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/user', { credentials: 'include' });
            if (res.status === 401) throw new Error('Session expired');
            if (!res.ok) throw new Error('Failed to fetch user');
            const userData = await res.json();
            setUser(userData);
            setError(null);
        } catch (err) {
            setUser(null);
            setToken(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Login failed');
            }
            const { token: jwt, user: userData } = await res.json();
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

    const register = async (username, email, password) => {
        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });
            if (!res.ok) {
                await res.json();
                throw new Error('Registration failed');
            }
            const { token: jwt, user: userData } = await res.json();
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
        fetch('/api/logout', { method: 'POST', credentials: 'include' });
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
                register,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};
