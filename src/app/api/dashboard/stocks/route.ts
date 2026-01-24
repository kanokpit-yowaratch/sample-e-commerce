import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/errors';

// Create Stock
export async function POST(req: Request) {
	const { productId, quantity } = await req.json();
	try {
		const newStock = await prisma.stock.create({
			data: {
				productId,
				quantity,
			},
		});
		return Response.json(newStock, { status: 201 });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Get Stocks
export async function GET() {
	try {
		const categories = await prisma.stock.findMany();
		return Response.json(categories);
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
