export interface UploadFormData {
	file: File;
	orderId: number;
	paidAmount: string;
}

export interface UploadVerificationResult {
	imageUrl: string;
	verification: EasySlipResult | null;
	comparison: SlipComparison | null;
}

export interface CreatePaymentRecordParams {
	paidAmount: string;
	imageUrl: string;
	orderId: number;
	comparison: SlipComparison | null;
}

export interface SlipComparison {
	amount: { match: boolean; slipAmount: number; orderAmount: number };
	dateTime: { valid: boolean; transDateTime: string | null; orderCreatedAt: string };
	overall: boolean;
	source: string | null;
}

export interface EasySlipResult {
	slipAmount: number;
	transDateTime: Date;
	rawSlip: unknown;
}

export interface VerifyResult {
	success: boolean;
	message?: string;
	data?: {
		amountInSlip?: number;
		rawSlip?: {
			date?: string;
			transRef?: string;
			sender?: {
				bank?: string;
				account?: string;
			};
			receiver?: {
				bank?: string;
				account?: string;
				merchantId?: string;
			};
		};
	};
	comparison?: VerifyComparison;
}

export interface VerifyComparison {
	amount: {
		match: boolean;
		slipAmount: number;
		orderAmount: number;
	};
	dateTime: {
		valid: boolean;
		transDateTime: string | null;
		orderCreatedAt: string;
	};
	overall: boolean;
	source: string | null;
}
