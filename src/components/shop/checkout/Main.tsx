'use client';

import React, { useEffect, useState } from 'react';

import { ProductCart } from '@/types/product';
import { CheckoutProps, PaymentMethod } from '@/types/checkout';
import useCartStore from '@/stores/zustand/useCartStore';
import useBuyNowStore from '@/stores/zustand/useBuyNowStore';
import ShippingAddressForm from './ShippingAddressForm';
import { CreditCard, CheckCircle, Package } from 'lucide-react';
import useShippingAddressStore from '@/stores/zustand/useShippingAddressStore';
import NextImage from 'next/image';

function CheckoutMainPage({ source }: Readonly<CheckoutProps>) {
  const { items: itemsFromCart } = useCartStore();
  const { items: itemsFromBuyNow } = useBuyNowStore();
  const { shippingFee } = useShippingAddressStore();
  const [products, setProducts] = useState<ProductCart[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const calculationTotal = (products: ProductCart[]) => {
    const subtotalCalc = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalCalc = subtotalCalc + shippingFee;
    setSubtotal(subtotalCalc);
    setTotal(totalCalc);
  }

  const onCheckOut = async () => {
    // Send Request Here
  };

  useEffect(() => {
    if (source === 'cart') {
      setProducts(itemsFromCart);
      calculationTotal(itemsFromCart);
    } else if (source === 'buynow') {
      setProducts(itemsFromBuyNow);
      calculationTotal(itemsFromBuyNow);
    }
  }, [source, itemsFromCart, itemsFromBuyNow]);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8 text-center">ยืนยันคำสั่งซื้อ</h1>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left side */}
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Package className="text-blue-600" size={20} />
                  <h2 className="font-semibold text-lg">รายการสินค้า ({products.length})</h2>
                </div>
              </div>

              <div className="p-4 divide-y divide-gray-100">
                {products.map((product) => (
                  <div key={product.id} className="py-1 flex items-center">
                    <div className="relative w-16 h-16 overflow-hidden rounded-lg shadow-sm">
                      <NextImage
                        src={product.image ?? '/images/photo-mask.jpg'}
                        fill={true}
                        objectFit="cover"
                        priority={true}
                        alt="Product cover"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-500 text-sm">จำนวน: {product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <ShippingAddressForm />
          </div>

          {/* Right sidebar */}
          <div className="w-full flex flex-col gap-4 lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={20} />
                  <h2 className="font-semibold text-lg">วิธีการชำระเงิน</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="mr-3"
                    />
                    <CreditCard size={20} className="mr-2 text-blue-600" />
                    <span>บัตรเครดิต / เดบิต</span>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mr-3"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-blue-600">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span>โอนเงินผ่านธนาคาร</span>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'prompt_pay'}
                      onChange={() => setPaymentMethod('prompt_pay')}
                      className="mr-3"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-blue-600">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="2" />
                      <path d="M10 14h4" />
                      <path d="M12 12v4" />
                    </svg>
                    <span>พร้อมเพย์</span>
                  </label>
                </div>
              </div>
            </div>

            {/* สรุปคำสั่งซื้อ */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="font-semibold text-lg mb-4">สรุปคำสั่งซื้อ</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>ราคาสินค้าทั้งหมด</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shippingFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span className="text-blue-600">฿{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                onClick={onCheckOut}>
                <CheckCircle size={20} />
                ยืนยันการสั่งซื้อ
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                การสั่งซื้อของคุณจะได้รับการยืนยันหลังจากที่เราได้รับการชำระเงิน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutMainPage;