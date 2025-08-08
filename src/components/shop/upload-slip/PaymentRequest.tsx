'use client';

import React, { useEffect, useState } from 'react';
import useCheckoutStore from '@/stores/zustand/useCheckoutStore';
import UploadSlip from '@/components/shop/upload-slip/UploadSlip';
import { thaiFormatDate } from '@/lib/common';
import { useItem } from '@/hooks/useQueryProtected';
import { OrderSet } from '@/types/order';

export default function PaymentRequestCp() {
	const { total, paid_amount, orderId } = useCheckoutStore();
	const { data, refetch } = useItem<OrderSet>('orders', orderId);
	const [orderNumber, setOrderNumber] = useState<string>('');
	const [orderTotal] = useState(total);
	const [paidAmount] = useState(paid_amount);

	useEffect(() => {
		if (orderId != 0) {
			refetch();
		}
	}, [orderId]);

	useEffect(() => {
		if (data) {
			setOrderNumber(data.order?.orderNumber);
		}
	}, [data]);

	return (
		<div className="flex items-center justify-center p-4">
			<div className="bg-gray-100 rounded-3xl shadow p-6 max-w-md w-full text-center relative overflow-hidden transition-all duration-300">
				<h1 className="text-2xl font-bold text-gray-800 mb-4">ยืนยันการชำระเงิน</h1>

				<div className="bg-gradient-to-r from-emerald-50 to-purple-50 rounded-2xl p-6 mb-4 border-l-4 border-emerald-600">
					<div className="space-y-4">
						<div className="flex justify-between items-center py-3 border-b border-gray-200">
							<span className="text-gray-600">เลขที่คำสั่งซื้อ:</span>
							<span className="font-medium text-gray-800">#{orderNumber}</span>
						</div>
						<div className="flex justify-between items-center py-3 border-b border-gray-200">
							<span className="text-gray-600">วันที่สั่งซื้อ:</span>
							<span className="font-medium text-gray-800">{thaiFormatDate()}</span>
						</div>
						<div className="flex justify-between items-center font-semibold text-emerald-600">
							<span>ยอดรวมออเดอร์:</span>
							<span className="text-xl">{orderTotal} บาท</span>
						</div>
						<div className="flex justify-between items-center font-semibold text-emerald-600">
							<span>ยอดที่ชำระ:</span>
							<span className="text-xl">{paidAmount} บาท</span>
						</div>
					</div>
				</div>

				<UploadSlip />

				<p className="text-gray-700">สินค้าของคุณจะถูกจัดส่ง</p>
				<p className="text-gray-700">เมื่อเจ้าหน้าที่ยืนยันคำสั่งซื้อของคุณแล้ว</p>
			</div>
		</div>
	);
}
