import { sampleAddress, ShippingAddress } from '@/types/address';

export function addressToReadableText(address: ShippingAddress): string {
  const parts = [
    address.name && `ชื่อ: ${address.name}`,
    address.phone && `โทร: ${address.phone}`,
    address.address1 && `ที่อยู่: ${address.address1}`,
    address.address2 && `${address.address2}`,
    address.city && `เมือง: ${address.city}`,
    address.province && `จังหวัด: ${address.province}`,
    address.zipcode && `รหัสไปรษณีย์: ${address.zipcode}`
  ].filter(Boolean);

  return parts.join(' | ');
}

export async function userAddress(): Promise<ShippingAddress> {
  try {
    const defaultAddress = await fetch('/api/protected/user/default-address', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (defaultAddress.ok) {
      const data: ShippingAddress = await defaultAddress.json();
      if (data?.id) {
        return data;
      }
    }
    return sampleAddress;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to sync cart to DB';
    console.log(message);
    return sampleAddress;
  }
}

export function validateAddress(address: ShippingAddress): boolean {
  if (address.name && address.phone && address.address1 && address.address2 && address.city && address.province && address.zipcode) {
    return true;
  }
  return false;
}
