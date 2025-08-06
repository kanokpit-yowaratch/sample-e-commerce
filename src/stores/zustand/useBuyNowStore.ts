import { create } from 'zustand';
import { ProductCart } from '@/types/product';
import { BuyNowState } from '@/types/checkout';

const useBuyNowStore = create<BuyNowState>()((set, get) => ({
	items: [],
	total: 0,
	addToBuyNow: async (product: ProductCart) => {
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
	},
	reset: () => set({ items: [], total: 0 }),
}));

export default useBuyNowStore;
