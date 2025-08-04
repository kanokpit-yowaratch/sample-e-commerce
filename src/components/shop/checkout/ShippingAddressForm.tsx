'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShippingAddress } from '@/types/address';
import useShippingAddressStore from '@/stores/zustand/useShippingAddressStore';
import { useCreateItem, usePatchItem } from '@/hooks/useQueryProtected';
import { Truck, MapPin, User, Phone, Save, X, Edit2 } from 'lucide-react';
import { shippingAddressSchema, ShippingAddressSchema } from '@/lib/schemas/shipping-address-schema';
import { useForm } from 'react-hook-form';

function ShippingAddressForm() {
  const { address, setShippingAddress } = useShippingAddressStore();
  const { mutate: mutateCreate } = useCreateItem<ShippingAddress, ShippingAddress>('user/default-address');
  const { mutate: mutatePatch } = usePatchItem<ShippingAddress, ShippingAddress>('user/default-address', address?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ShippingAddress>(address);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const {
    register,
    setValue,
    clearErrors,
  } = useForm<ShippingAddressSchema>({
    resolver: zodResolver(shippingAddressSchema),
    reValidateMode: 'onChange',
    defaultValues: address,
  });

  const handleEdit = () => {
    setEditForm(address);
    setIsEditing(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    clearErrors(name as keyof ShippingAddressSchema);
    Object.entries({ [name]: value }).forEach(([fieldName, fieldValue]) => {
      setValue(fieldName as keyof ShippingAddressSchema, fieldValue, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    });
  };

  const handleSave = () => {
    setAddressLoading(true);
    if (address.id === 0) {
      mutateCreate(editForm, {
        onSuccess: (response) => {
          setShippingAddress(response);
          setIsEditing(false);
          setAddressLoading(false);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } else {
      mutatePatch(editForm, {
        onSuccess: (response) => {
          setShippingAddress(response);
          setIsEditing(false);
          setAddressLoading(false);
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

  useEffect(() => {
    if (address) {
      setValue('name', address.name);
      setValue('phone', address.phone);
      setValue('address1', address.address1);
      setValue('address2', address.address2);
      setValue('city', address.city);
      setValue('province', address.province);
      setValue('zipcode', address.zipcode);
    }
  }, [address, setValue]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <Truck className="text-blue-600" size={20} />
          <h2 className="font-semibold text-lg">ที่อยู่จัดส่ง</h2>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              {addressLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังดำเนินการ...
                </span>
              ) : (
                <>
                  <Save size={16} />
                  บันทึก
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              <X size={16} />
              ยกเลิก
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            <Edit2 size={16} />
            แก้ไขที่อยู่
          </button>
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
                  {...register('name')}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ชื่อ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone size={16} className="inline mr-1" />
                  เบอร์โทรศัพท์
                </label>
                <input
                  {...register('phone')}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เบอร์โทรศัพท์"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={16} className="inline mr-1" />
                เลขที่บ้าน / หมู่ที่ / ซอย / ถนน / หมู่บ้าน
              </label>
              <input
                {...register('address1')}
                onChange={handleInputChange}
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
                {...register('address2')}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ที่อยู่"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  อำเภอ
                </label>
                <input
                  {...register('city')}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เขต/อำเภอ"
                />
              </div>
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                  จังหวัด
                </label>
                <input
                  {...register('province')}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="จังหวัด"
                />
              </div>
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสไปรษณีย์
                </label>
                <input
                  {...register('zipcode')}
                  onChange={handleInputChange}
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