'use client';

import React, { ChangeEvent, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, LoginSchema } from '@/lib/schemas/login-schema';
import { signIn } from 'next-auth/react'; // getSession
import { useRouter } from 'next/navigation';

export default function Login() {
	const [loginForm, setLoginForm] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		reValidateMode: 'onChange',
		defaultValues: { email: '', password: '' },
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginForm({ ...loginForm, [name]: value });
	};

	const onSubmitLogin = async () => {
		setError('');
		try {
			const result = await signIn('credentials', {
				email: loginForm.email,
				password: loginForm.password,
				redirect: false,
			});

			if (result?.error) {
				setError('Authentication failed.');
			} else if (result?.ok) {
				router.push('/dashboard');
				router.refresh();
			}
		} catch (error) {
			console.error('Sign in error:', error);
		}
	};

	return (
		<div className="container mx-auto px-4 md:px-20 my-4 mb-16 rounded-full w-full">
			<div className="blackground-body">
				<form onSubmit={handleSubmit(onSubmitLogin)}>
					<div className="flex flex-col justify-center items-center bg-white px-4 py-4">
						<div className="flex justify-center items-center">
							<strong className="text-2xl text-blue-600">Admin Login</strong>
						</div>
						<div className="flex items-center justify-center h-4 mt-4">
							{error && <span className="text-red-600">{error}</span>}
						</div>
						<div className="flex flex-col justify-center items-center gap-4 mt-2">
							<div>
								<input
									{...register('email')}
									className="border rounded-md p-2"
									placeholder="Name"
									onChange={handleChange}
								/>
								{errors.email && <p className="text-red-500">{errors.email.message}</p>}
							</div>
							<div>
								<input
									placeholder="Enter your password"
									{...register('password')}
									type={'password'}
									className="border rounded-md p-2"
									onChange={handleChange}
								/>
							</div>
							<div className="flex justify-center">
								<button
									type="submit"
									className="bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-5 py-2">
									Log in
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
