'use client';

import { useDeleteItem, useItems } from '@/hooks/useQueryDashboard';
import { useModal } from '@/stores/zustand/modalStore';
import { Category } from '@prisma/client';
import { CategoryModal } from '@/components/dashboard/category/CategoryModal';
import { Plus, Edit, Trash } from 'lucide-react';

export default function CategoryList() {
	const { data: categories, isLoading } = useItems<Category[]>('categories');
	const { mutate: mutateDelete } = useDeleteItem('categories');
	const { open } = useModal();

	const handleDelete = async (id: number) => {
		const confirmDelete = confirm('Are you sure you want to delete this category?');
		if (confirmDelete) {
			mutateDelete(id);
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Category list</h2>
				<button
					onClick={() => open()}
					className="flex place-items-center gap-1 bg-green-700 text-white px-4 py-2 rounded-md btn-primary cursor-pointer hover:bg-green-800 transition-all">
					<Plus />
					Create
				</button>
			</div>
			<div className="h-12">{isLoading && <span>Loading...</span>}</div>
			<ul className="space-y-2">
				{categories?.map((cat) => (
					<li key={cat.id} className="flex justify-between items-center bg-white shadow p-4 rounded-md">
						<span>{cat.name}</span>
						<div className="flex items-center space-x-1">
							<button
								className="flex items-center gap-1 bg-amber-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-amber-700 transition-all"
								onClick={() => open(`${cat.id}`)}>
								<Edit />
								Edit
							</button>
							<button
								className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-red-700 transition-all"
								onClick={() => handleDelete(cat.id)}>
								<Trash />
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
			<CategoryModal />
		</div>
	);
}
