import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { IdParamProps } from '@/types/common';
import { getOrderById } from '@/lib/order';
import { Prisma } from '@prisma/client';

// Get Single Order
export async function GET(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	try {
		const order = await getOrderById(parseInt(id));
		if (!order) {
			throw new ApiError('Not Found order', 404);
		}
		const orderItems = await prisma.orderItem.findMany({
			where: { orderId: order.id },
			include: { product: true },
		});
		const orderPaymentHistory = await prisma.orderPaymentHistory.findMany({
			where: {
				orderId: order.id
			}
		});
		return NextResponse.json(
			{
				order,
				orderItems,
				orderPaymentHistory,
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Update Order some fields
export async function PATCH(req: Request, { params }: IdParamProps) {
	try {
		const body = await req.json();
		const { id } = await params;
		const orderId = parseInt(id);
		const updateData: Prisma.OrderUpdateInput = {};
		if (body.order_number !== undefined) {
			updateData.orderNumber = body.order_number;
		}
		if (body.total !== undefined) {
			updateData.total = Number(body.total);
		}
		if (body.order_status !== undefined) {
			updateData.status = body.order_status;
		}
		if (body.shipping_address !== undefined) {
			updateData.shippingAddress = body.shipping_address;
		}
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
		}
		const updateOrder = await prisma.order.update({
			where: { id: orderId },
			data: updateData,
		});
		return Response.json(updateOrder, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
