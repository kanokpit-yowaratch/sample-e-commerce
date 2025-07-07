import CheckoutMainPage from '@/components/shop/checkout/Main';
import { QueryParamsProps } from '@/types/common';

export default async function CheckoutPage({ searchParams }: Readonly<QueryParamsProps>) {
  const query = await searchParams;
  const source = query.from ?? ''; // cart, buynow

  return <CheckoutMainPage source={source} />
}
