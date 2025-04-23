import { ProductCart } from './product';

export type CartItem = ProductCart & {
	quantity: number;
};

export interface CartState {
	items: CartItem[];
	total: number;
	addToCart: (product: ProductCart) => void;
	removeFromCart: (productId: string | number) => void;
	updateQuantity: (productId: string, newQuantity: number) => void;
	clearCart: () => void;
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
	item: CartItem;
	onQuantityChange: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
}

export interface CartSummaryProps {
	subtotal: number;
	shipping: number;
	itemCount: number;
	onCheckout: () => void;
}
