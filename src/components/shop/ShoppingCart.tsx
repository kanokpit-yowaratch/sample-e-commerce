'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/zustand/loginStore';
import CartSummary from './CartSummary';
import { Trash2Icon } from 'lucide-react';
import CartItemComponent from './Cart';
import useCartStore from '@/stores/zustand/useCartStore';

export default function ShoppingCart() {
	const { data: session } = useSession();
	const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
	const { openPopup } = useLoginStore();
	const router = useRouter();

	const handleQuantityChange = (id: number, quantity: number) => {
		updateQuantity(id, quantity);
	};

	const handleRemoveItem = (id: number) => {
		removeFromCart(id);
	};

	const handleCheckout = () => {
		if (session) {
			router.push('/checkout?from=cart');
		} else {
			openPopup();
		}
	};

	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shipping = 0; // Free shipping in this example
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<div className="max-w-6xl mx-auto px-4 py-6">
			<div className="w-full flex items-center mb-2">
				<button
					onClick={clearCart}
					className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors">
					<Trash2Icon size={18} />
					<span>Clear Cart</span>
				</button>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow-sm mb-4">
						<div>
							{items.map((item) => (
								<CartItemComponent
									key={item.id}
									item={item}
									onQuantityChange={handleQuantityChange}
									onRemove={handleRemoveItem}
								/>
							))}
						</div>
					</div>
				</div>

				<div className="lg:col-span-1">
					<CartSummary
						subtotal={subtotal}
						shipping={shipping}
						itemCount={itemCount}
						onCheckout={handleCheckout}
					/>
				</div>
			</div>
		</div>
	);
}
