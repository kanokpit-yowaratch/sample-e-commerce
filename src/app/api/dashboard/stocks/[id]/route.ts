import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { IdParamProps } from '@/types/common';
import { ApiError } from '@/lib/errors';

// Get Single Product Stock
export async function GET(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	try {
		const stock = await prisma.product.findUnique({
			where: { id: parseInt(id) },
		});
		if (!stock) {
			throw new ApiError('Not found', 404);
		}
		return NextResponse.json(stock, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Update Product Stock
export async function PUT(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const stockId = parseInt(id);
	try {
		if (isNaN(stockId)) {
			throw new ApiError('Invalid stock ID', 400);
		}

		const { productId, quantity } = await req.json();
		if (!productId) {
			throw new ApiError('Product Id is required', 400);
		}

		const stock = await prisma.stock.findUnique({
			where: { id: stockId },
		});

		if (!stock) {
			throw new ApiError('Stock not found', 404);
		}

		stock.productId = productId;
		stock.quantity = quantity;

		const updatedStock = await prisma.stock.update({
			where: { id: stockId },
			data: stock,
		});

		return NextResponse.json(updatedStock, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Delete Product Stock
export async function DELETE(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const stockId = parseInt(id);

	try {
		const stock = await prisma.stock.findUnique({
			where: { id: stockId },
		});

		if (!stock) {
			throw new ApiError('Stock not found', 404);
		}

		await prisma.stock.delete({
			where: { id: stockId },
		});

		return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
