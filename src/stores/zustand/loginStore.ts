import { create } from 'zustand';

interface LoginState {
	isOpen: boolean;
	openPopup: () => void;
	closePopup: () => void;
	togglePopup: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
	isOpen: false,
	openPopup: () => set({ isOpen: true }),
	closePopup: () => set({ isOpen: false }),
	togglePopup: () => set((state) => ({ isOpen: !state.isOpen })),
}));
