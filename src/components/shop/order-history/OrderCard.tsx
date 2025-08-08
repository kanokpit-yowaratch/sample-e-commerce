'use client';

import { OrderHistory } from '@/types/order';
import { parseAddress } from '@/lib/address';
import { formatCurrency, getOrderHistoryText, getOrderStatusColor, thaiFormatDate, thaiFormatPrice } from '@/lib/common';
import { Clock, MapPin, Package, Phone, User, Wallet } from "lucide-react";

const OrderCard = ({ order }: { order: OrderHistory }) => {
  const { name, phone, addressText } = parseAddress(order.shippingAddress);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between flex-wrap mb-4">
          <div className="flex space-x-2">
            <Package className="text-blue-600" />
            <div>
              <h3 className="font-medium text-md text-gray-900">#{order.orderNumber}</h3>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-green-600">{thaiFormatPrice(Number(order.total))}</span>
          </div>
        </div>
        <div className="space-y-1 mb-2">
          <div className="flex items-start space-x-3">
            <div className="flex items-start space-x-2">
              <User className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900">{name}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-700">{phone}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">{addressText}</p>
            </div>
          </div>
        </div>
        <div className="border-t py-2">
          <div className="grid grid-cols-2 gap-4">
            {/* <div className="flex items-center space-x-2">
							<Calendar className="h-4 w-4 text-gray-400" />
							<div className="flex items-center gap-2">
								<p className="text-xs text-gray-500">สั่งซื้อ</p>
								<p className="text-sm font-medium text-gray-900">{thaiFormatDate(order.created_at.toString())}</p>
							</div>
						</div> */}
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">ยอดที่ชำระ</p>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(order.paid_amount)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">อัปเดต</p>
                <p className="text-sm font-medium text-gray-900">{thaiFormatDate(order.updatedAt?.toString())}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-md text-xs font-medium ${getOrderStatusColor(order.status)}`}>
          {
            order.status === 'PROCESSING' ?
              'จ่ายมัดจำแล้วรอการตอบกลับการยืนยันจากร้านค้า' :
              getOrderHistoryText(order.status ?? 'PROCESSING')
          }
        </div>
      </div>
    </div>
  );
};

export default OrderCard;