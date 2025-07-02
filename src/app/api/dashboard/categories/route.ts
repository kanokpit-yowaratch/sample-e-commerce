import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { getCategoryByName } from '@/lib/category';

// Get Categories
export async function GET() {
	try {
		const categories = await prisma.category.findMany();
		return NextResponse.json(categories, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Create Category
export async function POST(req: NextRequest) {
	const { name } = await req.json();

	try {
		const category = await getCategoryByName(name);
		if (category) {
			throw new ApiError('This category is already in the system.', 400);
		}

		const newCategory = await prisma.category.create({ data: { name } });
		return NextResponse.json(newCategory, { status: 201 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
