'use client';

import React from 'react';
import OrderCard from './OrderCard';
import { useItems } from '@/hooks/useQueryProtected';
import { OrderHistory } from '@/types/order';

function OrderHistoryList() {
	const { data, isLoading } = useItems<OrderHistory[]>('order-history');

	return (
		<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
			<div className="h-6">{isLoading && (<span>Loading..</span>)}</div>
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">รายการคำสั่งซื้อ</h1>
					<p className="text-gray-600">จำนวนคำสั่งซื้อทั้งหมด {data?.length ?? 0} รายการ</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{!isLoading && data?.map((order) => (
						<OrderCard key={`${order.id}-${order.orderNumber}`} order={order} />
					))}
				</div>
			</div>
		</div>
	);
}

export default OrderHistoryList;
