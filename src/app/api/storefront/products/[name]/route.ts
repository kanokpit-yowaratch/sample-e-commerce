import { ApiError } from '@/lib/errors';
import { NameParamProps } from '@/types/common';
import { getProductByName } from '@/lib/product';

// Get Single Product by Name
export async function GET(req: Request, { params }: NameParamProps) {
	const { name } = await params;
	try {
		const product = await getProductByName(name);
		if (!product) {
			throw new ApiError('Not Found product', 404);
		}
		return Response.json(product, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
