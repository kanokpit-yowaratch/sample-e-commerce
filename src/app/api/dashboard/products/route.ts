import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { ApiError } from '@/lib/errors';
import { SortOrder } from '@/types/common';
import { ImageType } from '@prisma/client';

// Get Products with pagination
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const search = searchParams.get('search') ?? '';
	const perPage = parseInt(searchParams.get('perPage') ?? '10', 10) || 10;
	const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;
	const sort = (searchParams.get('sort') as SortOrder) || SortOrder.asc;

	const selectAttrs = {
		id: true,
		name: true,
		description: true,
		price: false,
		categoryId: true,
		createdAt: true,
		updatedAt: true,
		category: {
			select: {
				id: true,
				name: true,
			},
		},
		stocks: {
			select: {
				id: true,
				productId: true,
				quantity: true,
			},
		},
		images: {
			select: {
				id: true,
				filePath: true,
				productId: true,
			},
			where: {
				imageType: ImageType.cover,
			}
		}
	};

	const orderByItem = { createdAt: sort };

	let whereCondition = {};
	if (search?.trim()) {
		whereCondition = {
			...whereCondition,
			name: {
				contains: search,
				mode: 'insensitive',
			},
		};
	}

	try {
		const skip = perPage * (page - 1);

		const allProduct = await prisma.product.findMany({
			select: selectAttrs,
			where: whereCondition,
			orderBy: [orderByItem],
		});

		const products = await prisma.product.findMany({
			select: selectAttrs,
			where: whereCondition,
			orderBy: [orderByItem],
			skip,
			take: perPage,
		});

		const responseProducts = {
			data: products,
			pagination: {
				total: allProduct.length,
				page,
				perPage,
			},
		};

		return Response.json(responseProducts, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// Create Product
export async function POST(req: NextRequest) {
	try {
		const { name, description, price, categoryId } = await req.json();
		const newProduct = await prisma.product.create({
			data: {
				name,
				description,
				price: Number(price),
				categoryId: parseInt(categoryId),
			},
		});
		return Response.json(newProduct);
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
	}
}
