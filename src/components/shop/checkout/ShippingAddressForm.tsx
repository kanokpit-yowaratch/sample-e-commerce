'use client';

import React, { useState } from 'react';
import { Truck, MapPin, User, Phone, Save, X, Edit2 } from 'lucide-react';
import { ShippingAddress } from '@/types/address';
import useShippingAddressStore from '@/stores/zustand/useShippingAddressStore';
import { useCreateItem, usePatchItem } from '@/hooks/useQueryProtected';

function ShippingAddressForm() {
  const { address, setShippingAddress } = useShippingAddressStore();
  const { mutate: mutateCreate } = useCreateItem('user/default-address');
  const { mutate: mutatePatch } = usePatchItem('user/default-address', address.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ShippingAddress>(address);

  const handleEdit = () => {
    setEditForm(address);
    setIsEditing(true);
  };

  const handleSave = () => {
    setShippingAddress(editForm);
    setIsEditing(false);
    if (address.id === 0) {
      mutateCreate(editForm, {
        onSuccess: (response) => {
          console.log(response);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } else {
      mutatePatch(editForm, {
        onSuccess: (response) => {
          console.log(response);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  };

  const handleCancel = () => {
    setEditForm(address);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <Truck className="text-blue-600" size={20} />
          <h2 className="font-semibold text-lg">ที่อยู่จัดส่ง</h2>
        </div>
        {isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              <Save size={16} />
              บันทึก
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              <X size={16} />
              ยกเลิก
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {!isEditing ? (
          // Info Mode
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User size={18} className="mt-1 text-gray-400" />
              <p className="text-gray-700">{address.name}</p>
            </div>
            <div className="flex items-start gap-2">
              <Phone size={18} className="mt-1 text-gray-400" />
              <p className="text-gray-700">{address.phone}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={18} className="mt-1 text-gray-400" />
              <p className="text-gray-700">
                {address.address1}, {address.address2}, {address.city}, {address.province}, {address.zipcode}
              </p>
            </div>
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              <Edit2 size={16} />
              แก้ไขที่อยู่
            </button>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User size={16} className="inline mr-1" />
                  ชื่อ-สกุล / บริษัท
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ชื่อ"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone size={16} className="inline mr-1" />
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="เบอร์โทรศัพท์"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={16} className="inline mr-1" />
                เลขที่บ้าน / หมู่ที่ / ซอย / ถนน / หมู่บ้าน
              </label>
              <input
                type="text"
                value={editForm.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ที่อยู่"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={16} className="inline mr-1" />
                แขวง
              </label>
              <input
                type="text"
                value={editForm.address2}
                onChange={(e) => handleInputChange('address2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ที่อยู่"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อำเภอ
                </label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เขต/อำเภอ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  จังหวัด
                </label>
                <input
                  type="text"
                  value={editForm.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="จังหวัด"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  value={editForm.zipcode}
                  onChange={(e) => handleInputChange('zipcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="รหัสไปรษณีย์"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShippingAddressForm;