'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { CategorySchema, categorySchema } from '@/lib/schemas/category-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/stores/zustand/modalStore';
import { useForm } from 'react-hook-form';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { CategoryCreate } from '@/types/category';
import { useCreateItem, useItem, useUpdateItem } from '@/hooks/useQueryDashboard';

export const CategoryModal = () => {
	const { isOpen, selectedId, close } = useModal();
	const { mutate: mutateCreate } = useCreateItem('categories');
	const { data, isLoading, error } = useItem<CategoryCreate>('categories', selectedId ?? '');
	const { mutate: mutateUpdate } = useUpdateItem('categories', selectedId ?? '');
	const [category, setCategory] = useState<CategoryCreate>({ name: '' });

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		reset,
	} = useForm<CategorySchema>({
		resolver: zodResolver(categorySchema),
		defaultValues: { name: '' },
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCategory({ ...category, [name]: value });
	};

	const handleCloseModal = () => {
		reset();
		close();
	};

	const onSubmit = () => {
		if (selectedId) {
			mutateUpdate(category, {
				onSuccess: () => {
					reset();
					close();
				},
				onError: (error) => {
					setError('name', { message: error.message });
				},
			});
		} else {
			mutateCreate(category, {
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

	useEffect(() => {
		if (data) {
			setValue('name', data.name);
			setCategory({ ...category, name: data.name });
		}
	}, [data, setValue]);

	return (
		<Dialog open={isOpen} onClose={close} className="relative z-50">
			<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-xl font-semibold">
							{selectedId ? 'Edit category' : 'Create Category'}
						</DialogTitle>
						<button className="cursor-pointer" onClick={() => handleCloseModal()}>
							<X className="h-5 w-5" />
						</button>
					</div>
					<div className="h-10">{selectedId && isLoading && <span>Loading...</span>}</div>
					{error && <div>Error: {error.message}</div>}
					{selectedId && !data && !isLoading && !error && <div>Category not found</div>}

					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700">
								Name
							</label>
							<input
								{...register('name')}
								className="w-full border p-2 rounded-md"
								placeholder="Category name"
								onChange={handleChange}
							/>
							<div className="w-full h-10 p-2 rounded-md">
								{errors.name && <span className="text-red-500">{errors.name.message}</span>}
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={(selectedId && isLoading) || (!selectedId && !category.name)}
								className={`flex items-center justify-center px-4 py-2 text-white rounded-md transition-all
            ${
							(selectedId && isLoading) || (!selectedId && !category.name)
								? 'bg-blue-600/80 cursor-not-allowed'
								: 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
						}`}>
								{selectedId ? 'Update' : 'Create'}
							</button>
						</div>
					</form>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
