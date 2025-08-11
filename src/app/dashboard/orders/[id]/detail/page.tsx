import React from 'react';
import { IdParamProps } from '@/types/common';
import ProdcutDetail from '@/components/dashboard/order/Detail';

const ProductIdPage = async ({ params }: IdParamProps) => {
	const { id } = await params;

	return <ProdcutDetail id={id} />;
};

export default ProductIdPage;
