import React from 'react';
import type { Metadata } from 'next';
import ProductDetailCp from '@/components/shop/ProductDetail';
import { NameParamProps } from '@/types/common';
import { ProductDetail } from '@/types/product';
import { readWithRevalidate } from '@/lib/apiFetcher';
import { notFound } from 'next/navigation';

async function getProduct(name: string): Promise<ProductDetail | null> {
	try {
		return await readWithRevalidate<ProductDetail>(`${process.env.API_URL}/api/storefront/products/${name}`);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Internal server error';
		console.log(message);
		return null;
	}
}

export async function generateMetadata({ params }: NameParamProps): Promise<Metadata> {
	const { name } = await params;
	const product = await getProduct(name);

	if (!product) {
		return {
			title: 'Product Not Found',
		};
	}

	if (product) {
		return {
			title: product.name,
			description: product.description.substring(0, 160),
			openGraph: {
				title: product.name,
				description: product.description.substring(0, 160),
				images: [{ url: product.images[0]?.filePath ?? '' }],
			},
		};
	} else {
		return {
			title: 'Product Not Found',
		};
	}
}

const ProductDetailPage = async ({ params }: NameParamProps) => {
	const { name } = await params;
	const product = await getProduct(name);

	if (!product) {
		return notFound();
	}

	return (
		<div>
			<ProductDetailCp product={product} />
		</div>
	);
};

export default ProductDetailPage;
