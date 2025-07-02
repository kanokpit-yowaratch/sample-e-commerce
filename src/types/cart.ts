import { ProductCart } from './product';

export interface CartState {
	items: ProductCart[];
	total: number;
	addToCart: (product: ProductCart) => Promise<void>;
	removeFromCart: (productId: number) => Promise<void>;
	updateQuantity: (productId: number, newQuantity: number) => Promise<void>;
	clearCart: () => Promise<void>;
	syncCartToDB: (userEmail: string, mode?: string) => Promise<void>;
}

export type Cart = {
	id: string;
	name: string;
	description: string;
	price: number;
	createdAt: Date;
	updatedAt: Date;
};

export const resetCartCreateForm = {
	title: '',
	description: '',
	price: 0,
};

export type createCartInput = {
	title: string;
	description: string;
	price: number;
};

export type CartResponseData = {
	data: Cart[];
	success: boolean;
};

export interface CartItemProps {
	item: ProductCart;
	onQuantityChange: (id: number, quantity: number) => void;
	onRemove: (id: number) => void;
}

export interface CartSummaryProps {
	subtotal: number;
	shipping: number;
	itemCount: number;
	onCheckout: () => void;
}
