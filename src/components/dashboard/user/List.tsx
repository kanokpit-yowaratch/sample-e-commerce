'use client';

import React, { useState } from 'react';
import { Pencil, Trash, Search, Plus } from 'lucide-react';
import { useModal } from '@/stores/zustand/modalStore';
import { useDeleteItem, useItemsWithPagination } from '@/hooks/useQueryDashboard';
import { UserResponse } from '@/types/user';
import { PaginationResponse } from '@/types/common';
import Pagination from '@/components/ui/Pagination';
import { UserModal } from './UserModal';

const UserDataTable = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');
	const [search, setSearch] = useState('');
	const { mutate: mutateDelete } = useDeleteItem<string>('users');
	const { open } = useModal();
	const {
		data: users,
		isLoading,
		error,
	} = useItemsWithPagination<UserResponse, PaginationResponse<UserResponse>>('users', {
		page,
		perPage,
		search,
	});

	const handleDelete = (id: string) => {
		const result = confirm('Are you sure you want to delete this information?');
		if (result) {
			mutateDelete(id);
		}
	};

	const resetData = () => {
		setPage(1);
		setPerPage(10);
		setSearchTerm('');
		setSearch('');
	};

	return (
		<div className="w-full p-4 rounded-lg shadow-sm">
			<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div className="left-3">
					<h1>Users</h1>
				</div>
				<div className="right-3">
					<button
						onClick={() => open()}
						className="flex place-items-center gap-1 bg-green-700 text-white px-4 py-2 rounded-md btn-primary cursor-pointer hover:bg-green-800 transition-all">
						<Plus />
						Create
					</button>
				</div>
			</div>
			<div className="relative flex items-center gap-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-64"
				/>
				<button
					className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md"
					onClick={() => setSearch(searchTerm)}>
					Search
				</button>
				<button className="bg-gray-200 px-4 py-2 cursor-pointer rounded-md" onClick={() => resetData()}>
					Reset
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-secondary text-secondary-foreground">
							<th className="p-4">Name</th>
							<th className="p-4">Description</th>
							<th className="p-4">Price</th>
							<th className="p-4">Created At</th>
							<th className="p-4 text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						{isLoading && (
							<tr>
								<td colSpan={6} className="p4 text-center">
									Loading...
								</td>
							</tr>
						)}
						{error && (
							<tr>
								<td colSpan={6} className="p4 text-center">
									{error.message}
								</td>
							</tr>
						)}
						{users?.data?.map((item, index) => (
							<tr
								key={item.id}
								className={`border-b border-border hover:bg-muted transition-colors ${index % 2 === 0 ? 'bg-card' : 'bg-secondary'}`}>
								<td className="p-4">{item.name}</td>
								<td className="p-4">{item.email}</td>
								<td className="p-4">{item.phone}</td>
								<td className="p-4">{item.createdAt?.toString().slice(0, 10) ?? ''}</td>
								<td className="p-4">
									<div className="w-full flex items-center justify-center gap-2">
										<button
											className="flex items-center gap-1 bg-amber-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-amber-700 transition-all"
											onClick={() => open(`${item.id}`)}>
											<Pencil />
										</button>
										<button
											className="py-1 px-2 bg-red-600 text-white cursor-pointer rounded-md"
											onClick={() => handleDelete(item.id)}>
											<Trash />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination
				pageItems={users?.data.length ?? 0}
				totalItems={users?.pagination.total ?? 0}
				currentPage={page}
				setCurrentPage={setPage}
				rowsPerPage={perPage}
				setRowsPerPage={setPerPage}
			/>
			<UserModal />
		</div>
	);
};

export default UserDataTable;
