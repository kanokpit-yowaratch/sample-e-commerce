import { create } from 'zustand';
import { sampleAddress, ShippingAddress, ShippingAddressState } from '@/types/address';

const useShippingAddressStore = create<ShippingAddressState>()((set) => ({
  address: sampleAddress,
  shippingFee: 0,
  setShippingFee: (fee: number) => {
    set({ shippingFee: fee });
  },
  setShippingAddress: (address: ShippingAddress) => {
    set({ address });
  },
}));

export default useShippingAddressStore;
