import { ProductCart } from './product';

export type ShippingAddress = {
  name: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zipCode: string;
  isDefault?: boolean;
};

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'prompt_pay';

export type CheckoutProps = {
  source: string;
}

export interface BuyNowState {
  items: ProductCart[];
  total: number;
  addToBuyNow: (product: ProductCart) => Promise<void>;
}

export const sampleAddress: ShippingAddress = {
  name: 'สมชาย ใจป้ำ',
  phone: '081-234-5678',
  address1: "123/456 หมู่บ้านทดสอบ ซอย 5",
  address2: "แขวง..",
  city: 'เขต..',
  province: "กรุงเทพมหานคร",
  zipCode: '99999'
};

export interface ShippingAddressState {
  address: ShippingAddress;
  shippingFee: number;
  setShippingFee: (fee: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
}
