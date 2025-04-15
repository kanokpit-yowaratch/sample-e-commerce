import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Create Stock
export async function POST(req: NextRequest) {
	const { productId, quantity } = await req.json();
	try {
		const newStock = await prisma.stock.create({
			data: {
				productId,
				quantity,
			},
		});
		return NextResponse.json(newStock, { status: 201 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Get Stocks
export async function GET() {
	try {
		const categories = await prisma.stock.findMany();
		return NextResponse.json(categories);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
