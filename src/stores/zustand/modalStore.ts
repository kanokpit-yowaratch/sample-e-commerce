import { create } from 'zustand';
import { ModalState } from '@/types/common';

export const useModal = create<ModalState>((set) => ({
	isOpen: false,
	selectedId: null,
	open: (id) => set({ isOpen: true, selectedId: id }),
	close: () => set({ isOpen: false, selectedId: null }),
}));
