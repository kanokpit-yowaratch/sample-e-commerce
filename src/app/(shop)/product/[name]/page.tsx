import React from 'react';
import ProductDetailCp from '@/components/shop/ProductDetail';
import { NameParamProps } from '@/types/common';

const ProductDetailPage = async ({ params }: NameParamProps) => {
	const { name } = await params;

	return (
		<div>
			<ProductDetailCp name={name} />
		</div>
	);
};

export default ProductDetailPage;
