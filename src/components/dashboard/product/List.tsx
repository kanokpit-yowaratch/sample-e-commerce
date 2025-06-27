'use client';

import React, { useState } from 'react';
import { Edit, Trash, Search } from 'lucide-react';
import { useItemsWithPagination } from '@/hooks/useQueryDashboard';
import Link from 'next/link';
import NextImage from 'next/image';
import { ProductResponse } from '@/types/product';
import { PaginationResponse } from '@/types/common';
import { getImageSrc } from '@/lib/common';
import Pagination from '@/components/ui/Pagination';
import DeleteButton from '@/components/ui/DeleteButton';
import EditLink from '@/components/ui/EditLink';

const ProductDataTable = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');
	const [search, setSearch] = useState('');
	const {
		data: products,
		isLoading,
		error,
	} = useItemsWithPagination<ProductResponse, PaginationResponse<ProductResponse>>('products', {
		page,
		perPage,
		search,
	});

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
					<h1>Products</h1>
				</div>
				<div className="right-3">
					<Link
						href="/dashboard/products/create"
						className="p-2 bg-blue-600 text-white cursor-pointer rounded-md">
						Create
					</Link>
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
							<th>Image</th>
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
						{products?.data?.map((item, index) => (
							<tr
								key={item.id}
								className={`border-b border-border hover:bg-muted transition-colors ${index % 2 === 0 ? 'bg-card' : 'bg-secondary'}`}>
								<td>
									<div className="relative w-20 h-15 m-1 rounded-md overflow-hidden shadow-md">
										<NextImage
											src={getImageSrc(item.images[0]?.filePath)}
											fill={true}
											objectFit="cover"
											priority={true}
											alt="Product cover"
											className="w-full h-auto"
										/>
									</div>
								</td>
								<td className="p-4">{item.name}</td>
								<td className="p-4">{item.description}</td>
								<td className="p-4">{item.price}</td>
								<td className="p-4">{item.createdAt?.toString().slice(0, 10) ?? ''}</td>
								<td className="p-4">
									<div className="w-full flex items-center justify-center gap-2">
										<EditLink
											resource={'data'}
											action={'update'}
											icon={Edit}
											module="products"
											id={item.id}
											className="flex items-center gap-1 bg-amber-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-amber-700 transition-all"
										/>
										<DeleteButton
											resource={'data'}
											action={'delete'}
											icon={Trash}
											module="products"
											id={item.id}
											className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-red-700 transition-all"
										/>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination
				pageItems={products?.data.length ?? 0}
				totalItems={products?.pagination.total ?? 0}
				currentPage={page}
				setCurrentPage={setPage}
				rowsPerPage={perPage}
				setRowsPerPage={setPerPage}
			/>
		</div>
	);
};

export default ProductDataTable;
