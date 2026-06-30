import { create } from 'zustand';
import { ProductCart } from '@/types/product';
import { BuyNowState } from '@/types/checkout';

const useBuyNowStore = create<BuyNowState>()((set) => ({
	items: [],
	total: 0,
	addToBuyNow: (product: ProductCart) => {
		set({
			items: [product],
			total: product.price * product.quantity,
		});
	},
	reset: () => set({ items: [], total: 0 }),
}));

export default useBuyNowStore;
