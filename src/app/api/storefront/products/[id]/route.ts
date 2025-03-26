import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
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
