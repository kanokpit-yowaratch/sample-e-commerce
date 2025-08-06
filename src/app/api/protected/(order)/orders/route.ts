import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApiError } from '@/lib/errors';
import { generateOrderNumber } from '@/lib/order';
import prisma from '@/lib/prisma';
import { checkUserExists } from '@/lib/user';
import { OrderItemRequest } from '@/types/order';

export async function POST(req: NextRequest) {
	try {
		const userData = await getSession();
		const existUser = await checkUserExists(userData?.user?.email ?? '');
		if (!existUser) {
			throw new ApiError('User not exists', 400);
		}
		const userId = existUser.id;

		const body = await req.json();
		const { subtotal, shippingFee, total, shippingAddress, order_status, orderItems } = body;
		const orderNumber = await generateOrderNumber();
		const orderCreated = await prisma.order.create({
			data: {
				orderNumber: orderNumber,
				subtotal,
				shippingFee: shippingFee,
				total,
				shippingAddress: shippingAddress,
				status: order_status, // default is CREATED
				userId,
			},
		});
		const orderId = orderCreated.id;
		await Promise.all(
			orderItems.map((item: OrderItemRequest) =>
				prisma.orderItem.upsert({
					where: {
						orderId_productId: {
							orderId,
							productId: item.productId,
						},
					},
					update: {
						quantity: item.quantity,
						unitPrice: item.unit_price,
						subtotal: item.subtotal,
					},
					create: {
						orderId,
						productId: item.productId,
						quantity: item.quantity,
						unitPrice: item.unit_price,
						subtotal: item.subtotal,
					},
				}),
			),
		);
		return NextResponse.json({ id: orderId }, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return Response.json({ error: error.message }, { status: 500 });
		} else {
			return Response.json({ error: 'An unknown error occurred' }, { status: 500 });
		}
	}
}
