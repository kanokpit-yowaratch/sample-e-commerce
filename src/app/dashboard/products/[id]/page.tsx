import React from 'react';
import { IdParamProps } from '@/types/common';
import ProdcutEdit from '@/components/dashboard/product/Edit';

const ProductIdPage = async ({ params }: IdParamProps) => {
	const { id } = await params;

	return <ProdcutEdit id={id} />;
};

export default ProductIdPage;
