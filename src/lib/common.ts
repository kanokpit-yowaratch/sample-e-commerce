import { OrderStatus } from "@prisma/client";
import { Boxes, CircleDollarSign, Home, LucideIcon, Rocket, Shield, Users } from "lucide-react";

export const getImageSrc = (filePath?: string | null): string => {
	if (filePath) {
		// For custom path within project
		// const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3000';
		// return `${baseUrl}/${filePath}`;
		return filePath;
	}
	return '/images/photo-mask.jpg';
};

export const mapIcon = (label: string): LucideIcon => {
	switch (label.toLowerCase()) {
		case 'dashboard':
			return Home;
		case 'users':
			return Users;
		case 'permissions':
			return Shield;
		case 'categories':
			return Boxes;
		case 'products':
			return Rocket;
		case 'orders':
			return CircleDollarSign;
		default:
			return Home;
	}
}

export const thaiFormatDate = (dateString: string = '') => {
	const date = dateString ? new Date(dateString) : new Date();
	return date.toLocaleDateString('th-TH', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

export const thaiFormatPrice = (price: number) => {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB',
		minimumFractionDigits: 0,
	}).format(price);
};

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB',
	}).format(amount);
};

export const getOrderStatusColor = (status: string) => {
	switch (status) {
		case 'PROCESSING':
			return 'bg-blue-200 text-blue-800';
		case 'COMPLETED':
			return 'bg-green-200 text-green-800';
		case 'CANCELLED':
			return 'bg-red-200 text-red-800';
		case 'REFUNDED':
			return 'bg-red-200 text-red-800';
		default:
			// CREATED
			return 'bg-gray-200 text-gray-800';
	}
};

export function getOrderHistoryText(method: OrderStatus): string {
	const statusMap = {
		CREATED: 'ยังไม่ชำระ',
		PROCESSING: 'ชำระบางส่วน',
		COMPLETED: 'ชำระครบแล้ว',
		CANCELLED: 'ยกเลิก',
		REFUNDED: 'คืนเงิน',
	};
	return statusMap[method];
}
