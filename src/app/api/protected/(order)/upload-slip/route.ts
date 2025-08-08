import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { getOrderById } from '@/lib/order';
import { Decimal } from '@prisma/client/runtime/library';
import { getSession } from '@/lib/auth';
import { checkUserExists } from '@/lib/user';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get('image') as File;
	const oId = formData.get('order_id') as string;
	const paid_amount = formData.get('paid_amount') as string;
	const orderId = parseInt(oId);
	try {
		const userData = await getSession();
		const existUser = await checkUserExists(userData?.user?.email ?? '');
		if (!existUser) {
			throw new ApiError('User not exists', 400);
		}
		if (!file) {
			throw new ApiError('No file uploaded', 400);
		}
		const apiUploadUrl = process.env.UPLOAD_API;
		const apiUploadKey = process.env.UPLOAD_KEY;
		if (!apiUploadUrl) {
			throw new ApiError('Failed to upload image', 500);
		}
		const formData = new FormData();
		formData.append('image', file);
		const apiUpload = await fetch(`${apiUploadUrl}?key=${apiUploadKey}`, {
			method: 'POST',
			body: formData,
		});
		if (!apiUpload.ok) {
			throw new ApiError('Failed to upload image', 500);
		}
		const data = await apiUpload.json();
		if (!data.success) {
			throw new ApiError('Failed to upload image', 500);
		}
		const order = await getOrderById(orderId);
		if (!order) {
			throw new ApiError('Not Found order', 404);
		}

		const paidAmount = Number(paid_amount) as unknown as Decimal;
		await prisma.orderPaymentHistory.create({
			data: {
				paid_amount: paidAmount,
				slip_path: `${data.data.url}`,
				orderId: orderId,
				// payment_method: PaymentMethod.PROMPTPAY,
				status: 'PAID',
			},
		});
		await prisma.order.update({
			where: { id: order.id },
			data: { status: 'PROCESSING' }
		});
		return NextResponse.json({ message: 'Transaction completed.' }, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ Message: 'Failed to upload image', status: 500 });
	}
}
