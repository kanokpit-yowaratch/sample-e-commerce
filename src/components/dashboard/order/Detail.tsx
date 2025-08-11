'use client';

import React, { useEffect, useState } from 'react';
import { IdParams } from '@/types/common';
import { OrderStatus } from '@prisma/client';
import { OrderAdminResponse } from '@/types/order';
import { useItem } from '@/hooks/useQueryDashboard';
import { calculateTotal, getImageSrc, getOrderHistoryText } from '@/lib/common';
import { MapPin, Phone, User } from 'lucide-react';
import { useIsClient } from '@/hooks/useIsClient';
import { parseAddress } from '@/lib/address';
import NextImage from 'next/image';
import Link from 'next/link';

const statusList = Object.entries(OrderStatus).map(([key, value]) => ({
	value: key,
	label: getOrderHistoryText(value),
}));

function OrderDetail({ id }: Readonly<IdParams>) {
	const { data, isLoading } = useItem<OrderAdminResponse>('orders', id);
	const { name, phone, addressText } = parseAddress(data?.shippingAddress ?? '');
	const [selectedStatus, setSelectedStatus] = useState<string | number>(data?.status ?? 'PROCESSING');
	const [preTotal, setPreTotal] = useState<number>(0);
	const isClient = useIsClient();

	useEffect(() => {
		setSelectedStatus(data?.status ?? 'PROCESSING');
	}, [data?.status]);

	useEffect(() => {
		if (data?.orderPaymentHistory[0]) {
			const leftPay = data.orderPaymentHistory[0]?.paid_amount;
			setPreTotal(Number(leftPay));
		}
	}, [data?.orderPaymentHistory]);

	if (!isClient) {
		return null;
	}

	return (
		<>
			<Link href={'/dashboard/orders'} className="p-2 bg-blue-600 text-white cursor-pointer rounded-md">
				Back
			</Link>
			<div className="mt-4 mb-2 text-xl font-bold">รายละเอียดคำสั่งซื้อ</div>
			<div className="h-5">
				{isLoading && <span>Loading...</span>}
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-2 text-gray-800">
					<div>เลขที่คำสั่งซื้อ: #{data?.orderNumber}</div>
					<div>ยอดที่ชำระ: {preTotal}</div>
					<div className="bg-gray-50 rounded-md">
						<div className="">ที่อยู่จัดส่ง</div>
						<div className="space-y-1 mt-2">
							<div className="flex -tems-center gap-4">
								<div className="flex items-start space-x-3">
									<div className="bg-slate-100 py-1 px-2 rounded-lg">
										<User className="w-4 h-4 text-slate-600" />
									</div>
									<div>
										<p className="text-slate-800">{name}</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<div className="bg-slate-100 py-1 px-2 rounded-lg">
										<Phone className="w-4 h-4 text-slate-600" />
									</div>
									<div className="text-slate-800">{phone}</div>
								</div>
							</div>

							<div className="flex items-start space-x-3">
								<div className="bg-slate-100 py-1 px-2 rounded-lg">
									<MapPin className="w-4 h-4 text-slate-600" />
								</div>
								<div>
									<p className="text-slate-800">{addressText}</p>
								</div>
							</div>
						</div>
					</div>
					<div className="flex gap-2 my-2">
						สถานะคำสั่งซื้อ:
						<span className="font-semibold text-gray-600">
							{statusList.find(c => c.value === selectedStatus)?.label}
						</span>
					</div>
				</div>
				<div>
					<div className="mb-1 text-gray-800">รายการสั่งซื้อ</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-100">
								<tr>
									<th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										รหัสรายการ
									</th>
									<th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										สินค้า
									</th>
									<th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										คำอธิบาย
									</th>
									<th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
										จำนวน
									</th>
									<th className="p-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										ราคาต่อหน่วย
									</th>
									<th className="p-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										รวม
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{data?.orderItems.map((item) => (
									<tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
										<td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">#{item.id}</td>
										<td className="p-2 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">{item.product.name}</div>
										</td>
										<td className="p-2">
											<div className="text-sm text-gray-900">{item.product.description}</div>
										</td>
										<td className="p-2 whitespace-nowrap text-center">
											{item.quantity}
										</td>
										<td className="p-2 whitespace-nowrap text-sm text-gray-900 text-right">
											฿{item.unitPrice}
										</td>
										<td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
											฿{calculateTotal(item.quantity, `${item.unitPrice}`)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="px-3 py-1 bg-gray-200 border-t border-gray-300">
						<div className="flex justify-between items-center">
							<div className="text-sm text-gray-600">รวมทั้งหมด {data?.orderItems.length} รายการ</div>
							<div className="text-gray-900">ยอดรวม: ฿{data?.total?.toString()}</div>
						</div>
					</div>
				</div>
			</div>
			{
				data?.orderPaymentHistory[0] && (
					<div>
						<div className="border border-gray-300 rounded-b-md">
							<table className="w-full text-sm">
								<thead className="bg-gray-50">
									<tr>
										<th className="p-2 text-right border-r border-gray-300">จำนวนที่ชำระ</th>
										<th className="p-2 text-left">วันที่ชำระ</th>
										<th className="p-2 text-left">สลิป</th>
										<th className="p-2 text-left">บันทึกเพิ่มเติม</th>
										<th className="p-2 text-left">ประเภทการชำระ</th>
										<th className="p-2 text-left">สถานะคำสั่งซื้อ</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="p-2 text-right">{data?.orderPaymentHistory[0]?.paid_amount?.toString()}</td>
										<td>
											{data?.orderPaymentHistory[0]?.created_at?.toString()}
										</td>
										<td>
											<NextImage src={getImageSrc(data?.orderPaymentHistory[0]?.slip_path)} width={30} height={50} alt="สลิป" />
										</td>
										<td>
											{data?.orderPaymentHistory[0]?.notes}
										</td>
										<td>
											{data?.orderPaymentHistory[0]?.payment_method}
										</td>
										<td>
											{data?.orderPaymentHistory[0]?.status}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="flex justify-end right-3 my-2">
							ยอดรวม:{' '}{data?.orderPaymentHistory[0]?.paid_amount?.toString()}/{data?.total?.toString()}
						</div>
					</div>
				)
			}
		</>
	);
}

export default OrderDetail;
