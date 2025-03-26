import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import prisma from "@/lib/prisma";
import { IdParamProps } from '@/types/common';
import { getProductById } from '@/lib/product';

// Get Single Product
export async function GET(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	try {
		const product = await getProductById(parseInt(id));
		if (!product) {
			throw new ApiError("Not Found product", 404);
		}
		return NextResponse.json(product, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// Update Product
export async function PUT(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const productId = parseInt(id);
	const { name, description, price, categoryId } = await req.json();

	try {
		const product = await getProductById(productId);
		if (!product) {
			throw new ApiError("Not Found product", 404);
		}

		const productUpdate = await prisma.product.update({
			where: { id: productId },
			data: { name, description, price, categoryId },
		});
		return NextResponse.json(productUpdate, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// Update Product some fields
export async function PATCH(req: Request, { params }: IdParamProps) {
	try {
		const { name, price } = await req.json();
		const { id } = await params;
		const productId = parseInt(id);
		return Response.json(
			await prisma.product.update({
				where: { id: productId },
				data: { name, price: Number(price) },
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// Delete Product
export async function DELETE(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const productId = parseInt(id);

	try {
		const product = await getProductById(parseInt(id));
		if (!product) {
			throw new ApiError("Not Found product", 404);
		}

		await prisma.product.delete({
			where: { id: productId },
		});

		return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}