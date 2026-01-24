import { ApiError } from '@/lib/errors';
import { NameParamProps } from '@/types/common';
import { getCategoryByName } from '@/lib/category';
import { getProductsByCategory } from '@/lib/product';

// Get Single Category
export async function GET(req: Request, { params }: NameParamProps) {
	const { name } = await params;
	try {
		const category = await getCategoryByName(name);
		if (!category) {
			throw new ApiError('Not Found category', 404);
		}
		const products = await getProductsByCategory(category.id);
		return Response.json({ category, products });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
