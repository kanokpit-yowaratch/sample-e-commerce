import { Product } from '@prisma/client';
import { Pagination } from './common';

export type ProductCreate = Pick<Product, 'name' | 'description' | 'price' | 'categoryId'>;
export type ProductDetail = Pick<Product, 'id' | 'name' | 'description' | 'price' | 'categoryId'> & {
	images: [
		{
			id: number;
			filePath: string;
		},
	];
};

export type ProductCart = {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
	[key: string]: unknown;
};

export type ProductResponse = Product & {
	category: {
		id: number;
		name: string;
	};
	stock: [];
	images: [
		{
			id: number;
			filePath: string;
		},
	];
};

export type ProductPagination = Pagination & {
	data: ProductResponse[];
};
