import { create } from 'zustand';
import { sampleAddress, ShippingAddress, ShippingAddressState } from '@/types/checkout';

const useShippingAddressStore = create<ShippingAddressState>()((set) => ({
  address: sampleAddress,
  shippingFee: 19,
  setShippingFee: (fee: number) => {
    set({ shippingFee: fee });
  },
  setShippingAddress: (address: ShippingAddress) => {
    set({ address });
  },
}));

export default useShippingAddressStore;
