import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/errors';
import { SortOrder } from '@/types/common';

// Get users with pagination
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const search = searchParams.get('search') ?? '';
	const perPage = parseInt(searchParams.get('perPage') ?? '10', 10) || 10;
	const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;
	const sort = (searchParams.get('sort') as SortOrder) || SortOrder.asc;

	const selectAttrs = {
		id: true,
		name: true,
		email: true,
		phone: true,
		role: true,
		// image: true,
		createdAt: true,
		updatedAt: true,
	};

	const orderByItem = { createdAt: sort };

	let whereCondition = {};
	if (search?.trim()) {
		whereCondition = {
			...whereCondition,
			name: {
				contains: search,
			},
		};
	}

	try {
		const skip = perPage * (page - 1);

		const allUser = await prisma.user.findMany({
			select: selectAttrs,
			where: whereCondition,
			orderBy: [orderByItem],
		});

		const users = await prisma.user.findMany({
			select: selectAttrs,
			where: whereCondition,
			orderBy: [orderByItem],
			skip,
			take: perPage,
		});

		const responseUsers = {
			data: users,
			pagination: {
				total: allUser.length,
				page,
				perPage,
			},
		};

		return Response.json(responseUsers, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Create User
export async function POST(req: NextRequest) {
	try {
		const { name, email, password, role } = await req.json();
		console.log(name, email, password, role);

		// const newUser = await prisma.user.create({
		// 	data: {
		// 		name,
		// 		email,
		// 		role,
		// 		price: Number(price),
		// 		categoryId: parseInt(categoryId),
		// 	},
		// });
		// return Response.json(newUser, { status: 201 });
		return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
	}
}
