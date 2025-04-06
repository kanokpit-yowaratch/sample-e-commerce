'use client';

import React, { ChangeEvent, useState } from 'react';
import { useCreateItem } from '@/hooks/useQueryDashboard';
import { CategorySchema, categorySchema } from '@/lib/schemas/category-schema';
import { CategoryCreate } from '@/types/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

function CreateCategory() {
	const { mutate: mutateCreate } = useCreateItem('categories');
	const [category, setCategory] = useState<CategoryCreate>({ name: '' });

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CategorySchema>({
		resolver: zodResolver(categorySchema),
		defaultValues: { name: '' },
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCategory({ ...category, [name]: value });
	};

	const onSubmit = () => {
		mutateCreate(category);
		reset();
	};

	return (
		<div>
			<Link href={'/dashboard/categories'} className="p-2 bg-blue-600 text-white">
				Back
			</Link>
			<div className="mt-4 mb-2 text-xl font-bold">Create new category</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
				<input
					{...register('name')}
					className="border p-2 rounded-md"
					placeholder="Category name"
					onChange={handleChange}
				/>
				<button type="submit" className="bg-blue-500 text-white px-4 py-2">
					Create
				</button>
				{errors.name && <p className="text-red-500">{errors.name.message}</p>}
			</form>
		</div>
	);
}

export default CreateCategory;
