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
					await get().syncCartToDB(session.user.email ?? '', 'add');
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
						await get().syncCartToDB(session.user.email ?? '', 'remove-item');
					}
				}
			},

			updateQuantity: async (productId: number, newQuantity: number) => {
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
						await get().syncCartToDB(session.user.email ?? '', 'update-quantity');
					}
				}
			},

			clearCart: async () => {
				set({ items: [], total: 0 });
				const session = await getSession();
				if (session?.user?.id) {
					await get().syncCartToDB(session.user.email ?? '', 'clear');
				}
			},

			syncCartToDB: async (userEmail: string, cartMode?: string) => {
				const cart = get();
				const cartNoImage = cart.items.map(({ id, name, price, quantity }) => ({
					id, name, price, quantity
				}));

				try {
					const syncResponse = await fetch('/api/protected/cart', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ mode: cartMode, userEmail, cart: { items: cartNoImage } }),
					});
					// has data in DB, no data in local
					if (!cartMode && syncResponse.ok && cart.items.length === 0) {
						const data = await syncResponse.json();
						data.cartItems.forEach((item: ProductCart) => {
							cart.addToCart(item);
						});
					}
				} catch (err) {
					const message = err instanceof Error ? err.message : 'Failed to sync cart to DB';
					console.log(message);
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
