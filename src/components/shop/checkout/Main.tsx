'use client';

import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import { ProductCart } from '@/types/product';
import { CheckoutProps } from '@/types/checkout';
import useCartStore from '@/stores/zustand/useCartStore';
import useBuyNowStore from '@/stores/zustand/useBuyNowStore';
import ShippingAddressForm from './ShippingAddressForm';
import { CheckCircle, Package } from 'lucide-react';
import { userAddress } from '@/lib/address';
import useShippingAddressStore from '@/stores/zustand/useShippingAddressStore';
import NextImage from 'next/image';

function CheckoutMainPage({ source }: Readonly<CheckoutProps>) {
  const { data: session } = useSession();
  const { items: itemsFromCart } = useCartStore();
  const { items: itemsFromBuyNow } = useBuyNowStore();
  const { shippingFee, setShippingAddress } = useShippingAddressStore();
  const [products, setProducts] = useState<ProductCart[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const calculationTotal = (products: ProductCart[]) => {
    const subtotalCalc = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalCalc = subtotalCalc + shippingFee;
    setSubtotal(subtotalCalc);
    setTotal(totalCalc);
  }

  const checkAddress = async () => {
    const address = await userAddress();
    if (address.id !== 0) {
      setShippingAddress(address);
    }
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

  useEffect(() => {
    if (session?.user.id) {
      checkAddress();
    }
  }, [session?.user.id]);

  return (
    <div className="py-8">
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

          <div className="w-full flex flex-col gap-4 lg:w-1/3">
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