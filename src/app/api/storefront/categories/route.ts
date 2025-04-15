import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get Categories
export async function GET() {
	try {
		const categories = await prisma.category.findMany();
		return NextResponse.json(categories, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
