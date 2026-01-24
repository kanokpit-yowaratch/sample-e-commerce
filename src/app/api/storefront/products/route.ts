import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/errors';

// Get Products
export async function GET() {
	try {
		const products = await prisma.product.findMany();
		return Response.json(products, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
