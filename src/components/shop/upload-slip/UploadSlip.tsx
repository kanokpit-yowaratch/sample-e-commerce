'use client';

import React, { useEffect, useState, useCallback, FormEvent } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { OrderSet } from '@/types/order';
import NextImage from 'next/image';
import useCartStore from '@/stores/zustand/useCartStore';
import useBuyNowStore from '@/stores/zustand/useBuyNowStore';
import useCheckoutStore from '@/stores/zustand/useCheckoutStore';
import { useUpload } from '@/hooks/useQueryProtected';
import { getImageSrc } from '@/lib/common';
import { read } from '@/lib/apiFetcher';
import {
	X,
	CloudUpload,
	UploadCloud,
	TriangleAlert,
	CheckCircle2,
	Calendar,
	Clock,
} from 'lucide-react';
import { OrderStatus } from '@prisma/client';
import type { VerifyResult } from '@/types/slip';

const PROTECTED_API = '/api/protected';
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const maxSize = 1 * 1024 * 1024; // 1MB

const UploadSlip = () => {
	const { clearCart } = useCartStore();
	const { reset: resetBuyNow } = useBuyNowStore();
	const { orderId, paid_amount, order_status, reset: resetOrder } = useCheckoutStore();
	const [imageFile, setImageFile] = useState<File>();
	const [imagePath, setImagePath] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { mutate: mutateUpload } = useUpload<{ message: string; verify?: VerifyResult }>('upload-slip');
	const [requestSuccess, setRequestSuccess] = useState(false);
	const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
	const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
		const selectedFile = acceptedFiles[0];
		setError(null);

		if (rejectedFiles.length > 0) {
			setError('Please check file type and size (max 1MB)');
			return;
		}

		if (!allowedImageTypes.includes(selectedFile.type)) {
			setError('File type not supported');
			return;
		}

		if (selectedFile.size > maxSize) {
			setError('File size exceeds 1MB limit');
			return;
		}

		setImageFile(selectedFile);

		const reader: FileReader = new FileReader();
		reader.onload = () => {
			const img: HTMLImageElement = new Image();
			if (typeof reader.result === 'string') {
				img.src = reader.result;
			}
		};
		reader.readAsDataURL(selectedFile);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
		},
		maxSize,
		multiple: false,
	});

	const removeFile = () => {
		setImageFile(undefined);
		setError(null);
	};

	const getFilePreview = () => {
		if (!imageFile && !imagePath) return null;

		if (imageFile) {
			if (imageFile.type.startsWith('image/')) {
				return (
					<div className="w-full h-75">
						<NextImage
							src={URL.createObjectURL(imageFile)}
							fill={true}
							objectFit="contain"
							priority={true}
							alt="Promptpay slip"
							className="h-75 object-cover rounded-lg"
						/>
					</div>
				);
			}
		}
		if (imagePath) {
			return (
				<div className="w-full h-75">
					<NextImage
						src={getImageSrc(imagePath)}
						fill={true}
						objectFit="contain"
						priority={true}
						alt="Promptpay slip"
						className="h-75 object-cover rounded-lg"
					/>
				</div>
			);
		}

		return (
			<div className="w-20 h-20 flex items-center justify-center rounded-lg">
				<UploadCloud className="w-8 h-8 text-primary" />
			</div>
		);
	};

	const clearState = () => {
		setRequestSuccess(true);
		setIsLoading(false);
		clearCart();
		resetBuyNow();
		resetOrder();
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setError(null);
		setRequestSuccess(false);
		setVerifyResult(null);

		if (!imageFile) {
			setError('Please select file.');
			return;
		}

		setIsLoading(true);

		const formData = new FormData();
		formData.append('image', imageFile);
		formData.append('order_id', `${orderId}`);
		formData.append('paid_amount', `${paid_amount}`);
		formData.append('status', `PROCESSING`);
		mutateUpload(formData, {
			onSuccess: (data) => {
				clearState();
				if (data?.verify) {
					setVerifyResult(data.verify);
				}
			},
			onError: (error) => {
				console.log(error);
				setIsLoading(false);
			},
		});
	};

	const checkOrderInDB = async (orderId: number, order_status: OrderStatus) => {
		read<OrderSet>(`${PROTECTED_API}/orders/${orderId}`).then((data) => {
			if (data.orderPaymentHistory) {
				const firstTransaction = data.orderPaymentHistory[0];
				if (firstTransaction?.slip_path) {
					setImagePath(firstTransaction.slip_path);
				}
			}
			if (data.order.status !== order_status) {
				if (data.order.status === 'PROCESSING' && order_status === 'CREATED') {
					clearState();
				}
			}
		});
	};

	useEffect(() => {
		if (Number(orderId) !== 0 && order_status) {
			checkOrderInDB(orderId, order_status);
		}
	}, [orderId, order_status]);

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full">
				<div
					{...getRootProps()}
					className={`w-full p-2 relative border-2 border-dashed border-gray-400 rounded-md cursor-pointer ${isDragActive ? 'bg-blue-300/5' : ''} ${error ? 'border-red-700 border-2 bg-red-600/5' : ''} transition-all duration-200 ease-in-out`}>
					<input {...getInputProps()} aria-label="File upload" />

					{!imageFile && !imagePath && (
						<div className="flex flex-col justify-center items-center text-sm">
							<CloudUpload className="w-12 h-12 mx-auto text-blue-800 mb-4" />
							<p className="text-blue-900 font-medium mb-2">คลิกเลือกรูปหรือลากวาง</p>
							<p className="text-sm text-blue-900">รองรับไฟล์นามสกุล JPG, PNG, GIF, WEBP (ขนาดไม่เกิน 1MB)</p>
						</div>
					)}

					{(imageFile || imagePath) && (
						<div className="relative">
							<div className="flex items-center justify-center">{getFilePreview()}</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									removeFile();
								}}
								className="absolute top-0 right-0 p-2 bg-red-600 hover:bg-red-700 rounded-sm transition-colors"
								aria-label="Remove file">
								<X className="w-5 h-5 text-white" />
							</button>
						</div>
					)}

					{error && (
						<div className="mt-4 text-destructive text-sm flex items-center justify-center">
							<TriangleAlert className="w-5 h-5 mr-2" />
							{error}
						</div>
					)}
				</div>
				{requestSuccess ? (
					<div className="flex justify-center text-green-800 font-medium text-md my-2">
						{`กำลังรอร้านค้าตรวจสอบยอด เพื่อยืนยันรับออเดอร์`}
					</div>
				) : (
					<button
						type="submit"
						disabled={!imageFile || isLoading}
						className={`flex items-center justify-center mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}>
						{isLoading ? <span className="animate-spin mr-2">⌛</span> : <></>}
						{isLoading ? 'กำลังส่งข้อมูล...' : 'แจ้งสลิปการโอนเงิน'}
					</button>
				)}
			</form>

			{verifyResult && (
				<div className="mt-4 w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
					<div
						className={`border-b p-4 flex items-center gap-3 ${verifyResult.comparison?.overall ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
						{verifyResult.comparison?.overall ? (
							<CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
						) : (
							<TriangleAlert className="w-5 h-5 text-amber-600 shrink-0" />
						)}
						<div>
							<p
								className={`text-sm font-semibold ${verifyResult.comparison?.overall ? 'text-emerald-800' : 'text-amber-800'}`}>
								{verifyResult.comparison?.overall ? 'สลิปผ่านการตรวจสอบแล้ว' : 'สลิปรอการตรวจสอบจากร้านค้า'}
							</p>
						</div>
						<span
							className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${verifyResult.comparison?.overall ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
							{verifyResult.comparison?.overall ? 'VERIFIED' : 'PENDING'}
						</span>
					</div>

					{verifyResult.comparison && !verifyResult.comparison.overall && (
						<div className="mx-5 mt-4 p-3 bg-white border border-amber-500 rounded-xl">
							<ul className="space-y-1 text-xs text-amber-800">
								{!verifyResult.comparison.amount.match && (
									<li className="flex items-center gap-2">
										<X className="w-3.5 h-3.5 text-red-500 shrink-0" />
										จำนวนเงินไม่ตรง: สลิป {verifyResult.comparison.amount.slipAmount.toLocaleString()} บาท ≠
										ออเดอร์ {verifyResult.comparison.amount.orderAmount.toLocaleString()} บาท
									</li>
								)}
								{!verifyResult.comparison.dateTime.valid && (
									<li className="flex items-center gap-2">
										<X className="w-3.5 h-3.5 text-red-500 shrink-0" />
										วันเวลาที่โอนต้องไม่อยู่ก่อนวันที่สั่งซื้อ
									</li>
								)}
							</ul>
						</div>
					)}

					{verifyResult.data?.amountInSlip != null && (
						<div className="p-5 space-y-5">
							<div className="text-center border-b border-dashed border-gray-200 pb-4">
								<p className="text-xs text-gray-500 font-medium">จำนวนเงินที่ทำรายการโอน</p>
								<p className="text-2xl font-bold text-gray-900 mt-1">
									฿
									{(verifyResult.data?.amountInSlip ?? 0).toLocaleString('th-TH', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									<span className="text-sm text-gray-400 font-medium ml-1">THB</span>
								</p>
							</div>

							{(() => {
								const dateStr = verifyResult.data?.rawSlip?.date;
								const dt = dateStr ? new Date(dateStr) : null;
								return (
									<div className="flex items-center gap-4 text-sm border-t border-gray-200 pt-4">
										<div className="flex items-center gap-2">
											<Calendar className="w-4 h-4 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">วันที่</p>
												<p className="text-sm font-medium text-gray-800">
													{dt
														? dt.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
														: 'ไม่ระบุ'}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">เวลา</p>
												<p className="text-sm font-medium text-gray-800">
													{dt ? dt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'ไม่ระบุ'} น.
												</p>
											</div>
										</div>
									</div>
								);
							})()}

							{verifyResult.data?.rawSlip?.transRef && (
								<div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center justify-between gap-3">
									<div className="min-w-0">
										<p className="text-xs text-gray-500 font-semibold">เลขอ้างอิง (Transaction Ref)</p>
										<p className="text-sm font-mono font-bold text-gray-700 truncate">
											{verifyResult.data.rawSlip.transRef}
										</p>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default UploadSlip;
