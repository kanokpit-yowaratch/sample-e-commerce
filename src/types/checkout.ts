import { ProductCart } from './product';

export type CheckoutProps = {
  source: string;
}

export interface BuyNowState {
  items: ProductCart[];
  total: number;
  addToBuyNow: (product: ProductCart) => Promise<void>;
  reset: () => void;
}
