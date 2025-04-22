import React from 'react';
import ProductByCategory from '@/components/shop/ProductByCategory';
import { NameParamProps } from '@/types/common';

const ProductCategoryPage = async ({ params }: NameParamProps) => {
	const { name } = await params;

	return (
		<div>
			<ProductByCategory name={name} />
		</div>
	);
};

export default ProductCategoryPage;
