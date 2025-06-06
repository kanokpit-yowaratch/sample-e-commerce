'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { UserSchema, userSchema } from '@/lib/schemas/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/stores/zustand/modalStore';
import { useForm } from 'react-hook-form';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { initialUser, roles, UserCreate, UserUpdate } from '@/types/user';
import { useCreateItem, useItem, usePatchItem } from '@/hooks/useQueryDashboard';

export const UserModal = () => {
	const { isOpen, selectedId, close } = useModal();
	const { mutate: mutateCreate } = useCreateItem('users');
	const { data, isLoading, error } = useItem<UserUpdate>('users', selectedId ?? '');
	const { mutate: mutateUpdate } = usePatchItem('users', selectedId ?? '');
	const [user, setUser] = useState<UserCreate>(initialUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		reset,
		clearErrors,
	} = useForm<UserSchema>({
		resolver: zodResolver(userSchema),
		defaultValues: initialUser,
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
		clearErrors(name as keyof UserSchema);
	};

	const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
		clearErrors('role');
	};

	const handleCloseModal = () => {
		reset();
		close();
	};

	const onSubmit = () => {
		if (selectedId) {
			console.log(selectedId);
			mutateUpdate(user, {
				onSuccess: () => {
					reset();
					close();
				},
				onError: (error) => {
					setError('name', { message: error.message });
				},
			});
		} else {
			mutateCreate(user, {
				onSuccess: () => {
					reset();
					close();
				},
				onError: (error) => {
					setError('name', { message: error.message });
				},
			});
		}
	};

	// For update
	useEffect(() => {
		if (data) {
			(Object.keys(data) as Array<keyof typeof data>).forEach(key => {
				setValue(key, data[key] ?? '');
			});

			setUser(prevUser => ({
				...prevUser, name: data.name ?? '',
				phone: data.phone ?? '',
				role: data.role ?? ''
			}));
		}
	}, [data, setValue]);

	return (
		<Dialog open={isOpen} onClose={close} className="relative z-50">
			<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-xl font-semibold">
							{selectedId ? 'Edit user' : 'Create user'}
						</DialogTitle>
						<button className="cursor-pointer" onClick={() => handleCloseModal()}>
							<X className="h-5 w-5" />
						</button>
					</div>
					<div className="h-10">{selectedId && isLoading && <span>Loading...</span>}</div>
					{error && <div>Error: {error.message}</div>}
					{selectedId && !data && !isLoading && !error && <div>User not found</div>}

					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700">
								Name
							</label>
							<input
								{...register('name')}
								className="w-full border p-2 rounded-md"
								placeholder="Name"
								onChange={handleChange}
							/>
							<div className="w-full h-6 text-sm">
								{errors.name && <span className="text-red-500">{errors.name.message}</span>}
							</div>
						</div>

						{
							!selectedId &&
							(
								<>
									<div>
										<label htmlFor="email" className="block text-sm font-medium text-gray-700">
											Email
										</label>
										<input
											{...register('email')}
											className="w-full border p-2 rounded-md"
											placeholder="Email"
											onChange={handleChange}
										/>
										<div className="w-full h-6 text-sm">
											{errors.email && <span className="text-red-500">{errors.email.message}</span>}
										</div>
									</div>

									<div>
										<label htmlFor="password" className="block text-sm font-medium text-gray-700">
											Password
										</label>
										<input
											{...register('password')}
											type="password"
											className="w-full border p-2 rounded-md"
											placeholder="Password"
											onChange={handleChange}
										/>
										<div className="w-full h-6 text-sm">
											{errors.password && <span className="text-red-500">{errors.password.message}</span>}
										</div>
									</div>
								</>
							)
						}

						<div className="flex flex-col gap-1">
							<span>Role</span>
							<select
								{...register('role')}
								className="border rounded-md p-2"
								onChange={handleRoleChange}
							>
								<option value="0">Select a role</option>
								{roles?.map((role) => (
									<option key={role} value={role}>
										{role}
									</option>
								))}
							</select>
							<div className="w-full h-6 text-sm">
								{errors.role && <p className="text-red-500">{errors.role.message}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
								Phone
							</label>
							<input
								{...register('phone')}
								className="w-full border p-2 rounded-md"
								placeholder="Phone"
								onChange={handleChange}
							/>
							<div className="w-full h-6 text-sm">
								{errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={(selectedId && isLoading) || (!selectedId && !user.role)}
								className={`flex items-center justify-center px-4 py-2 text-white rounded-md transition-all
            ${(selectedId && isLoading) || (!selectedId && !user.role)
										? 'bg-blue-600/80 cursor-not-allowed'
										: 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
									}`}>
								{selectedId ? 'Update' : 'Create'} {user.role}
							</button>
						</div>
					</form>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
