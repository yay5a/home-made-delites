'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, error, loading } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-amber-800">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-100 text-amber-800 font-bold rounded-lg shadow hover:bg-amber-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Need an account?{' '}
        <Link href="/register" className="text-amber-600 underline">
          Register
        </Link>
      </p>
    </div>
  );
}
