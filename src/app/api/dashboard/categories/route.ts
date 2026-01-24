import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { getCategoryByName } from '@/lib/category';

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

// Create Category
export async function POST(req: Request) {
	const { name } = await req.json();

	try {
		const category = await getCategoryByName(name);
		if (category) {
			throw new ApiError('This category is already in the system.', 400);
		}

		const newCategory = await prisma.category.create({ data: { name } });
		return Response.json(newCategory, { status: 201 });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
