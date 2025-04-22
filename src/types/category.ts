import { Category } from '@prisma/client';
import { ProductDetail } from './product';

export type CategoryCreate = Pick<Category, 'name'>;

export type CategoryWithProducts = Category & {
	products: ProductDetail[];
};
