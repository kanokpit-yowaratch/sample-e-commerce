import { ApiError } from './errors';
import prisma from './prisma';
import { getOrderById } from './order';
import { Decimal } from '@prisma/client/runtime/library';
import { getSession } from './auth';
import { checkUserExists } from './user';
import { CreatePaymentRecordParams, EasySlipResult, SlipComparison, UploadFormData, UploadVerificationResult } from '@/types/slip';

export async function uploadToImgbb(file: File): Promise<string> {
	const url = process.env.UPLOAD_API;
	const key = process.env.UPLOAD_KEY;
	if (!url) throw new ApiError('Upload service not configured', 500);

	const formData = new FormData();
	formData.append('image', file);
	const res = await fetch(`${url}?key=${key}`, { method: 'POST', body: formData });
	if (!res.ok) throw new ApiError('Failed to upload image to external service', 500);

	const data = await res.json();
	if (!data.success) throw new ApiError('Image upload rejected by external service', 500);
	return `${data.data.url}`;
}

export async function verifyWithEasySlip(file: File): Promise<EasySlipResult | null> {
	const apiUrl = process.env.EASYSLIP_API_URL ?? '';
	const apiKey = process.env.EASYSLIP_API_KEY ?? '';
	if (!apiKey) return null;

	try {
		const formData = new FormData();
		formData.append('image', file);
		const res = await fetch(apiUrl, {
			method: 'POST',
			headers: { Authorization: `Bearer ${apiKey}` },
			body: formData,
		});
		if (!res.ok) return null;

		const json = await res.json();
		if (!json.success) return null;

		const slipAmount = json.data?.amountInSlip ?? 0;
		const dateStr = json.data?.rawSlip?.date ?? '';
		const transDateTime = dateStr ? new Date(dateStr) : null;
		if (!transDateTime) return null;

		return { slipAmount, transDateTime, rawSlip: json.data };
	} catch (err) {
		console.log('--- Verify Error ---', err instanceof Error ? err.message : err);
		return null;
	}
}

export function compareSlipData(
	slipAmount: number,
	transDateTime: Date,
	paidAmount: number,
	orderCreatedAt: Date,
): SlipComparison {
	const amountMatch = Math.abs(slipAmount - paidAmount) < 1;

	const endOfToday = new Date();
	endOfToday.setHours(23, 59, 59, 999);

	const dateValid = transDateTime >= orderCreatedAt && transDateTime <= endOfToday;

	return {
		amount: { match: amountMatch, slipAmount, orderAmount: paidAmount },
		dateTime: {
			valid: dateValid,
			transDateTime: transDateTime.toISOString(),
			orderCreatedAt: orderCreatedAt.toISOString(),
		},
		overall: amountMatch && dateValid,
		source: 'easyslip',
	};
}

export async function parseUploadFormData(req: Request): Promise<UploadFormData> {
	const formData = await req.formData();
	const file = formData.get('image') as File;
	const oId = formData.get('order_id') as string;
	const paidAmount = formData.get('paid_amount') as string;
	const orderId = parseInt(oId);

	if (!file) throw new ApiError('No file uploaded', 400);

	return { file, orderId, paidAmount };
}

export async function validateUser() {
	const session = await getSession();
	const user = await checkUserExists(session?.user?.email ?? '');
	if (!user) throw new ApiError('User not exists', 400);
	return user;
}

export async function validateOrderForPayment(orderId: number, userId: string) {
	const order = await getOrderById(orderId);
	if (!order) throw new ApiError('Not Found order', 404);
	if (order.userId !== userId) throw new ApiError('Unauthorized: this order does not belong to you', 403);
	if (order.status !== 'CREATED') throw new ApiError('Order is not in a payable state', 400);
	return order;
}

export function validatePaymentAmount(paidAmountStr: string, orderTotal: Decimal): Decimal {
	const paidAmount = new Decimal(paidAmountStr);
	if (paidAmount.lessThan(0.01)) throw new ApiError('Invalid paid amount', 400);
	if (!paidAmount.equals(orderTotal))
		throw new ApiError(`Paid amount (${paidAmount}) does not match order total (${orderTotal})`, 400);
	return paidAmount;
}

export async function handleExistingPaymentIfNeeded(orderId: number, orderCreatedAt: Date, orderTotal: Decimal) {
	const existingPayment = await prisma.orderPaymentHistory.findFirst({
		where: { orderId, status: 'PAID' },
		orderBy: { created_at: 'desc' },
	});
	if (!existingPayment) return;

	const timeDiff = existingPayment.created_at.getTime() - orderCreatedAt.getTime();
	const amountMatch = Number(existingPayment.paid_amount) === Number(orderTotal);
	const isVerified = amountMatch && timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000;

	if (isVerified) throw new ApiError('This order already has a verified paid slip uploaded', 400);

	await prisma.orderPaymentHistory.update({
		where: { id: existingPayment.id },
		data: { status: 'CANCELLED', notes: 'Replaced by retry upload' },
	});
}

export async function uploadAndVerifySlip(file: File, paidAmount: string, orderCreatedAt: Date): Promise<UploadVerificationResult> {
	const imageUrl = await uploadToImgbb(file);
	const paidAmountNum = Number(paidAmount);
	const verification = await verifyWithEasySlip(file);
	const comparison = verification
		? compareSlipData(verification.slipAmount, verification.transDateTime, paidAmountNum, orderCreatedAt)
		: null;

	return { imageUrl, verification, comparison };
}

export function buildVerificationNotes(comparison: SlipComparison | null): string | null {
	if (!comparison) return null;

	return JSON.stringify({
		verified: comparison.overall,
		source: comparison.source,
		amountMatch: comparison.amount.match,
		dateValid: comparison.dateTime.valid,
		slipAmount: comparison.amount.slipAmount,
		transDateTime: comparison.dateTime.transDateTime,
	});
}

export async function createPaymentRecord(params: CreatePaymentRecordParams) {
	const notes = buildVerificationNotes(params.comparison);

	await prisma.orderPaymentHistory.create({
		data: {
			paid_amount: params.paidAmount,
			slip_path: params.imageUrl,
			orderId: params.orderId,
			status: 'PAID',
			notes,
		},
	});
}

export async function updateOrderStatusAfterPayment(orderId: number, verified: boolean) {
	if (verified) {
		await prisma.order.update({
			where: { id: orderId },
			data: { status: 'PROCESSING' },
		});
	} else {
		await prisma.order.update({
			where: { id: orderId },
			data: { status: 'CREATED', notes: 'Slip uploaded but verification pending — manual review required' },
		});
	}
}

export function buildUploadResponse(verification: EasySlipResult | null, comparison: SlipComparison | null): Response {
	const verified = comparison?.overall ?? false;

	return Response.json(
		{
			message: verification
				? (verified ? 'Transaction completed and verified.' : 'Slip uploaded. Awaiting manual verification.')
				: 'Slip uploaded. Awaiting manual verification.',
			verify: {
				success: verification ? verified : false,
				message: verification ? undefined : 'รอการตรวจสอบจากเจ้าหน้าที่',
				source: verification ? 'easyslip' : null,
				data: verification?.rawSlip ?? null,
				comparison: comparison ?? null,
			},
		},
		{ status: 200 },
	);
}

export function handleApiError(error: unknown): Response {
	if (error instanceof ApiError) {
		return Response.json({ message: error.message, verify: null }, { status: error.statusCode });
	}
	return Response.json({ message: 'Failed to upload image', verify: null, status: 500 });
}
