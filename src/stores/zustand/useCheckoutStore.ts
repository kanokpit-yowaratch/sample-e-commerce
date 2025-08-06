import { create } from 'zustand';
import { CheckoutState, OrderRequest } from '@/types/order';
import { persist } from 'zustand/middleware';

const useCheckoutStore = create<CheckoutState>()(
	persist(
		// (set, get) => ({
		(set) => ({
			subtotal: 0,
			shippingFee: 0,
			orderItems: [],
			total: 0,
			paid_amount: 0,
			paymentMethod: 'promptpay',
			shippingAddress: '',
			orderId: 0,
			order_status: 'CREATED',
			addToCheckout: (orderRequest: OrderRequest) => {
				set({
					orderItems: orderRequest.orderItems,
					total: orderRequest.total,
					paid_amount: orderRequest.paid_amount,
					subtotal: orderRequest.subtotal,
					shippingFee: orderRequest.shippingFee,
					paymentMethod: orderRequest.paymentMethod,
					shippingAddress: orderRequest.shippingAddress,
					order_status: orderRequest.order_status,
				});
			},
			updateOrder: (orderId: number) => {
				set({ orderId });
			},
			updatePaidAmount: (paidAmount: number) => {
				set({ paid_amount: paidAmount });
			},
			reset: () =>
				set({
					subtotal: 0,
					shippingFee: 0,
					orderItems: [],
					total: 0,
					paid_amount: 0,
					paymentMethod: 'promptpay',
					shippingAddress: '',
					order_status: 'CREATED',
					orderId: 0,
				}),
		}),
		{
			name: 'checkout-storage-e-commerce',
			storage: {
				getItem: (name) => {
					const item = localStorage.getItem(name);
					return item ? JSON.parse(item) : null;
				},
				setItem: (name, value) => {
					localStorage.setItem(name, JSON.stringify(value));
				},
				removeItem: (name) => localStorage.removeItem(name),
			},
		},
	),
);

export default useCheckoutStore;
