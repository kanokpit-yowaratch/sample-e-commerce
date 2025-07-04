import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/errors';
import { IdParamProps } from '@/types/common';
import { getCategoryById } from '@/lib/category';

// Get Single Category
export async function GET(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	try {
		const category = await getCategoryById(parseInt(id));
		if (!category) {
			throw new ApiError('Not Found category', 404);
		}
		return NextResponse.json(category);
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Update Category
export async function PUT(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const categoryId = parseInt(id);
	try {
		if (isNaN(categoryId)) {
			throw new ApiError('Invalid category ID', 400);
		}

		const { name } = await req.json();
		if (!name) {
			throw new ApiError('Category name is required', 400);
		}

		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (!category) {
			throw new ApiError('Category not found', 400);
		}

		// Skip update if the name hasn't changed
		if (category.name === name) {
			return NextResponse.json(category, { status: 200 });
		}

		category.name = name;
		const updatedCategory = await prisma.category.update({
			where: { id: categoryId },
			data: category,
		});

		return NextResponse.json(updatedCategory, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			const target = error.meta?.target;
			if (Array.isArray(target) && target.includes('name')) {
				return NextResponse.json({ message: 'This name is already in use.' }, { status: 400 });
			}
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Delete Category
export async function DELETE(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const categoryId = parseInt(id);

	try {
		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (!category) {
			throw new ApiError('Category not found', 400);
		}

		await prisma.category.delete({
			where: { id: categoryId },
		});

		return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
