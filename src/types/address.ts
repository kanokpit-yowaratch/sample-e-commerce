export type ShippingAddress = {
  id: number;
  name: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zipcode: string;
  isDefault?: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  houseNumber?: string;
  street?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  accuracy?: number;
}

export const sampleAddress: ShippingAddress = {
  id: 0,
  name: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  zipcode: ''
}

export interface ShippingAddressState {
  address: ShippingAddress;
  shippingFee: number;
  setShippingFee: (fee: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
}
