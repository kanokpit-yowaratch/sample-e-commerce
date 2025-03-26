import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { ApiError } from '@/lib/errors';

// Get Products
export async function GET() {
	try {
		const products = await prisma.product.findMany();
		return Response.json(products, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
