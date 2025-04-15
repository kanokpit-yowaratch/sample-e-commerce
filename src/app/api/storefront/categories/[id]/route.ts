import { NextRequest, NextResponse } from 'next/server';
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
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
