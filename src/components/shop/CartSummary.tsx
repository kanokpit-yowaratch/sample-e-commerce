'use client';

import { CartSummaryProps } from '@/types/cart';

export default function CartSummary({
	subtotal,
	shipping,
	itemCount,
	onCheckout,
}: Readonly<CartSummaryProps>) {
	const total = subtotal + shipping;

	return (
		<div className="bg-white rounded-lg shadow-sm p-4">
			<h2 className="text-lg font-medium mb-4">สรุปคำสั่งซื้อ</h2>

			<div className="flex justify-between mb-2">
				<span className="text-gray-600">ยอดรวม (จำนวน {itemCount} ชิ้น)</span>
				<span>฿{subtotal.toFixed(2)}</span>
			</div>

			<div className="flex justify-between mb-4">
				<span className="text-gray-600">ค่าจัดส่ง</span>
				<span>฿{shipping.toFixed(2)}</span>
			</div>

			<div className="flex justify-between mb-2 font-medium">
				<span>ยอดรวม</span>
				<span className="text-orange-500">฿{total.toFixed(2)}</span>
			</div>

			<div className="text-xs text-gray-500 mb-4 text-right">ราคายังไม่รวมภาษี (ถ้ามี)</div>

			<button onClick={onCheckout} className="w-full bg-orange-500 text-white rounded-md py-3 font-medium">
				ดำเนินการชำระเงิน({itemCount})
			</button>
		</div>
	);
}
