'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Edit, Trash, Search, Settings, Info } from 'lucide-react';
import { useItemsWithPagination } from '@/hooks/useQueryDashboard';
import { PaginationResponse } from '@/types/common';
import Pagination from '@/components/ui/Pagination';
import DeleteButton from '@/components/ui/DeleteButton';
import EditLink from '@/components/ui/EditLink';
import { OrderAdminResponse } from '@/types/order';
import { thaiFormatPrice } from '@/lib/common';
import Link from 'next/link';

const OrderList = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');
	const [search, setSearch] = useState('');
	const {
		data: orders,
		isLoading,
		error,
	} = useItemsWithPagination<OrderAdminResponse, PaginationResponse<OrderAdminResponse>>('orders', {
		page,
		perPage,
		search,
	});

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			setSearch(searchTerm);
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
			<Link href={'/dashboard/products'} className="p-2 bg-blue-600 text-white cursor-pointer rounded-md">
				Back
			</Link>
			<div className="mt-4 mb-2 text-xl font-bold">รายการคำสั่งซื้อ</div>
			<div className="relative flex items-center gap-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyDown={handleKeyDown}
					className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-64"
				/>
				<button
					className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md"
					onClick={() => setSearch(searchTerm)}>
					ค้นหา
				</button>
				<button className="bg-gray-200 px-4 py-2 cursor-pointer rounded-md" onClick={() => resetData()}>
					ล้างค่าค้นหา
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th>เลขที่ออเดอร์</th>
							<th className="p-2 w-30 text-right">ยอดรวม</th>
							<th className="p-2 text-left">ที่อยู่จัดส่ง</th>
							<th className="p-2 w-25">สถานะ</th>
							<th className="p-2 w-25">วันที่สั่ง</th>
							<th className="p-2 flex justify-center">
								<Settings />
							</th>
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
								<td colSpan={6} className="p4">
									{error.message}
								</td>
							</tr>
						)}
						{orders?.data?.map((item, index) => (
							<tr
								key={item.id}
								className={`border-b border-border hover:bg-muted transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
								<td className="p-2 align-top">#{item.orderNumber}</td>
								<td className="p-2 align-top px-2 text-right">{thaiFormatPrice(Number(item.total))}</td>
								<td className="p-2 align-top text-left">
									<div>{item.shippingAddress.split('|').toString()?.substring(0, 50)}...</div>
								</td>
								<td className="p-2 align-top text-center">
									{item.status}
								</td>
								<td className="p-2 align-top text-center">
									<div className="w-25">{item.createdAt?.toString().slice(0, 10) ?? ''}</div>
								</td>
								<td className="p-2 align-top">
									<div className="w-full flex items-center justify-center gap-2">
										<Link
											href={`/dashboard/orders/${item.id}/detail`}
											className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-blue-600 transition-all"
										>
											<Info />
										</Link>
										<EditLink
											resource={'data'}
											action={'update'}
											icon={Edit}
											module="orders"
											id={item.id}
											className="flex items-center gap-1 bg-amber-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-amber-700 transition-all"
										/>
										<DeleteButton
											resource={'data'}
											action={'delete'}
											icon={Trash}
											module="orders"
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
				pageItems={orders?.data.length ?? 0}
				totalItems={orders?.pagination.total ?? 0}
				currentPage={page}
				setCurrentPage={setPage}
				rowsPerPage={perPage}
				setRowsPerPage={setPerPage}
			/>
		</div>
	);
};

export default OrderList;
