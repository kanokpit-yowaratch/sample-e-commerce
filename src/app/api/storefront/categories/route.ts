import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/errors';

// Get Categories
export async function GET() {
	try {
		const categories = await prisma.category.findMany();
		return Response.json(categories, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
