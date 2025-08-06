import { OrderStatus } from '@prisma/client';

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'promptpay';

export type CheckoutProps = {
  source: string;
};

export type OrderRequest = {
  subtotal: number;
  shippingFee: number;
  total: number;
  paid_amount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  order_status: OrderStatus;
  orderItems: OrderItemRequest[];
};

export type OrderItemRequest = {
  productId: number;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export interface CheckoutState {
  orderId: number;
  subtotal: number;
  shippingFee: number;
  orderItems: OrderItemRequest[];
  total: number;
  paid_amount: number;
  paymentMethod: string;
  shippingAddress: string;
  order_status: OrderStatus;
  addToCheckout: (orderRequest: OrderRequest) => void;
  updateOrder: (orderId: number) => void;
  updatePaidAmount: (paidAmount: number) => void;
  reset: () => void;
}

export type PromptpayScannerProps = {
  total: number;
};

export type OrderResponse = {
  id: number;
};
