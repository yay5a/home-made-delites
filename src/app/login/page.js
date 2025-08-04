'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
	const searchParams = useSearchParams();
	const [isRegisterMode, setIsRegisterMode] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const { login, register, isLoading, error } = useAuth();

	// Check URL params to determine if we should show register mode
	useEffect(() => {
		const registerParam = searchParams.get('register');
		if (registerParam === 'true') {
			setIsRegisterMode(true);
		}
	}, [searchParams]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isRegisterMode) {
			// Registration validation
			if (password !== confirmPassword) {
				alert('Passwords do not match');
				return;
			}

			if (password.length < 6) {
				alert('Password must be at least 6 characters long');
				return;
			}

			await register({
				email,
				password,
				firstName,
				lastName,
				username: username || undefined, // Optional field
			});
		} else {
			await login(email, password);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						{isRegisterMode ? 'Create your account' : 'Sign in to your account'}
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						{isRegisterMode ? (
							<>
								Already have an account?{' '}
								<button
									type='button'
									onClick={() => setIsRegisterMode(false)}
									className='font-medium text-indigo-600 hover:text-indigo-500'>
									Sign in here
								</button>
							</>
						) : (
							<>
								Don&apos;t have an account?{' '}
								<button
									type='button'
									onClick={() => setIsRegisterMode(true)}
									className='font-medium text-indigo-600 hover:text-indigo-500'>
									Register here
								</button>
							</>
						)}
					</p>
				</div>

				{error && (
					<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm'>
						{error}
					</div>
				)}

				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='space-y-4'>
						{isRegisterMode && (
							<>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<label
											htmlFor='firstName'
											className='block text-sm font-medium text-gray-700 mb-1'>
											First Name *
										</label>
										<input
											id='firstName'
											name='firstName'
											type='text'
											required
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
											placeholder='First name'
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
										/>
									</div>
									<div>
										<label
											htmlFor='lastName'
											className='block text-sm font-medium text-gray-700 mb-1'>
											Last Name *
										</label>
										<input
											id='lastName'
											name='lastName'
											type='text'
											required
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
											placeholder='Last name'
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor='username'
										className='block text-sm font-medium text-gray-700 mb-1'>
										Username (optional)
									</label>
									<input
										id='username'
										name='username'
										type='text'
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
										placeholder='Choose a username'
										value={username}
										onChange={(e) => setUsername(e.target.value)}
									/>
								</div>
							</>
						)}

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Email Address *
							</label>
							<input
								id='email'
								name='email'
								type='email'
								required
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								placeholder='Email address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Password *
							</label>
							<input
								id='password'
								name='password'
								type='password'
								required
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								placeholder={
									isRegisterMode ? 'Create a password (min 6 characters)' : 'Password'
								}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						{isRegisterMode && (
							<div>
								<label
									htmlFor='confirmPassword'
									className='block text-sm font-medium text-gray-700 mb-1'>
									Confirm Password *
								</label>
								<input
									id='confirmPassword'
									name='confirmPassword'
									type='password'
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									placeholder='Confirm your password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</div>
						)}
					</div>

					<div>
						<button
							type='submit'
							disabled={isLoading}
							className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'>
							{isLoading
								? isRegisterMode
									? 'Creating account...'
									: 'Signing in...'
								: isRegisterMode
								? 'Create Account'
								: 'Sign in'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
