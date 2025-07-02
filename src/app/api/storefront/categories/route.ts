import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/errors';

// Get Categories
export async function GET() {
	try {
		const categories = await prisma.category.findMany();
		return NextResponse.json(categories, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
