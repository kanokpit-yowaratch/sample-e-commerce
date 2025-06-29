import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { CartState } from '@/types/cart';
import { ProductCart } from '@/types/product';
import { getSession } from 'next-auth/react';

const storage: PersistStorage<CartState> = {
	getItem: (name) => {
		const item = localStorage.getItem(name);
		return item ? JSON.parse(item) : null;
	},
	setItem: (name, value) => {
		localStorage.setItem(name, JSON.stringify(value));
	},
	removeItem: (name) => localStorage.removeItem(name),
};

const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			// Initial state
			items: [],
			total: 0,

			// Actions
			addToCart: async (product: ProductCart) => {
				const { items, total } = get();
				const existingItem = items.find((item) => item.id === product.id);

				let updatedItems;

				if (existingItem) {
					updatedItems = items.map((item) =>
						item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item,
					);
				} else {
					updatedItems = [...items, product];
				}

				set({
					items: updatedItems,
					total: total + product.price,
				});

				const session = await getSession();
				if (session?.user?.id) {
					await get().syncCartToDB(session.user.email ?? '');
				}
			},

			removeFromCart: async (productId) => {
				const currentItems = get().items;
				const itemToRemove = currentItems.find((item) => item.id === productId);

				if (itemToRemove) {
					set({
						items: currentItems.filter((item) => item.id !== productId),
						total: get().total - itemToRemove.price * itemToRemove.quantity,
					});

					const session = await getSession();
					if (session?.user?.id) {
						await get().syncCartToDB(session.user.email ?? '');
					}
				}
			},

			updateQuantity: async (productId: string, newQuantity: number) => {
				const currentItems = get().items;
				const itemToUpdate = currentItems.find((item) => item.id === productId);

				if (itemToUpdate) {
					const updatedItems =
						newQuantity > 0
							? currentItems.map((item) =>
								item.id === productId ? { ...item, quantity: newQuantity } : item,
							)
							: currentItems.filter((item) => item.id !== productId); // ลบ item ถ้า quantity <= 0

					const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

					set({
						items: updatedItems,
						total: newTotal,
					});

					const session = await getSession();
					if (session?.user?.id) {
						await get().syncCartToDB(session.user.email ?? '');
					}
				}
			},

			clearCart: async () => {
				set({ items: [], total: 0 });
				const session = await getSession();
				if (session?.user?.id) {
					await get().syncCartToDB(session.user.email ?? '');
				}
			},

			syncCartToDB: async (userEmail: string) => {
				const cart = get();
				const cartNoImage = cart.items.map(({ id, name, price, quantity }) => ({
					id, name, price, quantity
				}));

				try {
					await fetch('/api/protected/cart', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ userEmail, cart: { items: cartNoImage } }),
					});
				} catch (err) {
					console.error('Failed to sync cart to DB', err);
				}
			},
		}),
		{
			name: 'cart-storage',
			storage, // Use the storage object we defined
		},
	),
);

export default useCartStore;
