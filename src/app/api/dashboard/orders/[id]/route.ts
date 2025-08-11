import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { IdParamProps } from '@/types/common';
import { getOrderById } from '@/lib/order';

// Get Single Order
export async function GET(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	try {
		const order = await getOrderById(parseInt(id));
		if (!order) {
			throw new ApiError('Not Found order', 404);
		}
		const orderDetail = await prisma.order.findFirst({
			select: {
				id: true,
				orderNumber: true,
				total: true,
				subtotal: true,
				status: true,
				shippingAddress: true,
				createdAt: true,
				orderItems: {
					select: {
						id: true,
						quantity: true,
						unitPrice: true,
						product: {
							select: {
								id: true,
								name: true,
								description: true,
								price: true,
							},
						},
					},
				},
				orderPaymentHistory: {
					select: {
						id: true,
						paid_amount: true,
						slip_path: true,
						payment_method: true,
						notes: true,
						status: true,
						created_at: true,
					},
				},
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			where: {
				id: parseInt(id),
			},
		});
		return NextResponse.json(orderDetail, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

// Update Order
export async function PUT(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const orderId = parseInt(id);

	try {
		const order = await getOrderById(orderId);
		if (!order) {
			throw new ApiError('Not Found order', 404);
		}
		// Add update here
		return NextResponse.json({ message: 'Updated successfully' }, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			const target = error.meta?.target;
			if (Array.isArray(target) && target.includes('name')) {
				return NextResponse.json({ message: 'This name is already in use.' }, { status: 400 });
			}
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

// Delete Order
export async function DELETE(req: NextRequest, { params }: IdParamProps) {
	const { id } = await params;
	const orderId = parseInt(id);

	try {
		const order = await getOrderById(parseInt(id));
		if (!order) {
			throw new ApiError('Not Found order', 404);
		}

		await prisma.order.delete({
			where: { id: orderId },
		});

		return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
