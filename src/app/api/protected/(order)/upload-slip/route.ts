import { rateLimitMiddleware, RATE_LIMIT } from '@/lib/rate-limiter';
import {
	parseUploadFormData,
	validateUser,
	validateOrderForPayment,
	validatePaymentAmount,
	handleExistingPaymentIfNeeded,
	uploadAndVerifySlip,
	createPaymentRecord,
	updateOrderStatusAfterPayment,
	buildUploadResponse,
	handleApiError,
} from '@/lib/upload-slip';

export async function POST(req: Request) {
	const limitResponse = await rateLimitMiddleware(RATE_LIMIT.uploadSlip)(req);
	if (limitResponse) return limitResponse;

	try {
		const { file, orderId, paidAmount } = await parseUploadFormData(req);
		const user = await validateUser();
		const order = await validateOrderForPayment(orderId, user.id);
		validatePaymentAmount(paidAmount, order.total);
		await handleExistingPaymentIfNeeded(orderId, order.createdAt, order.total);

		const { imageUrl, verification, comparison } = await uploadAndVerifySlip(file, paidAmount, order.createdAt);
		await createPaymentRecord({ paidAmount, imageUrl, orderId, comparison });
		await updateOrderStatusAfterPayment(order.id, comparison?.overall ?? false);

		return buildUploadResponse(verification, comparison);
	} catch (error) {
		return handleApiError(error);
	}
}
