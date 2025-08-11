import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/errors';
import { SortOrder } from '@/types/common';

// Get Orders with pagination
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const perPage = parseInt(searchParams.get('perPage') ?? '10', 10) || 10;
	const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;
	const sort = (searchParams.get('sort') as SortOrder) || SortOrder.desc;

	const selectAttrs = {
		id: true,
		orderNumber: true,
		total: true,
		shippingAddress: true,
		status: true,
		createdAt: true,
		updatedAt: true,
		orderPaymentHistory: {
			select: {
				status: true,
				paid_amount: true,
			},
		},
	};

	const orderByItem = { updatedAt: sort };

	try {
		const skip = perPage * (page - 1);

		const allData = await prisma.order.findMany({
			select: selectAttrs,
			orderBy: [orderByItem],
		});

		const datas = await prisma.order.findMany({
			select: selectAttrs,
			orderBy: [orderByItem],
			skip,
			take: perPage,
		});

		const responseDatas = {
			data: datas,
			pagination: {
				total: allData.length,
				page,
				perPage,
			},
		};

		return Response.json(responseDatas, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
