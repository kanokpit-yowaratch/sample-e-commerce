import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { SortOrder } from '@/types/common';

// Get permissions with pagination
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const search = searchParams.get('search') ?? '';
	const perPage = parseInt(searchParams.get('perPage') ?? '10', 10) || 10;
	const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;
	const sort = (searchParams.get('sort') as SortOrder) || SortOrder.asc;

	const selectAttrs = {
		id: true,
		roleId: true,
		resource: true,
		action: true,
		createdAt: true,
	};

	const orderByItem = { createdAt: sort };

	let whereCondition = {};
	if (search?.trim()) {
		whereCondition = {
			...whereCondition,
			resource: {
				contains: search,
			},
		};
	}

	try {
		const skip = perPage * (page - 1);

		const allData = await prisma.permission.findMany({
			select: selectAttrs,
			where: whereCondition,
			orderBy: [orderByItem],
		});

		const datas = await prisma.permission.findMany({
			select: selectAttrs,
			where: whereCondition,
			orderBy: [orderByItem],
			skip,
			take: perPage,
		});

		const responsePermissions = {
			data: datas,
			pagination: {
				total: allData.length,
				page,
				perPage,
			},
		};
		return NextResponse.json(responsePermissions, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Create Permission
export async function POST(req: NextRequest) {
	const { roleId, resource, action } = await req.json();
	try {
		const permission = await prisma.permission.findFirst({
			where: { roleId: parseInt(roleId, 10), resource, action }
		});

		if (permission) {
			throw new ApiError('This permission is already in the system.', 400);
		}

		const newPermission = await prisma.permission.create({
			data: {
				roleId: parseInt(roleId, 10),
				resource,
				action,
			}
		});
		return NextResponse.json(
			{
				...newPermission,
				message: 'Permission created successfully.'
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
