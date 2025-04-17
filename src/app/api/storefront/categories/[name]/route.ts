import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import { NameParamProps } from '@/types/common';
import { getCategoryByName } from '@/lib/category';
import { getProductsByCategory } from '@/lib/product';

// Get Single Category
export async function GET(req: NextRequest, { params }: NameParamProps) {
	const { name } = await params;
	try {
		const category = await getCategoryByName(name);
		if (!category) {
			throw new ApiError('Not Found category', 404);
		}
		const products = getProductsByCategory(name);
		return NextResponse.json({ category, products });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
