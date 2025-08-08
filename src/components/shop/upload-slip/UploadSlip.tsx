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
import { X, CloudUpload, UploadCloud, TriangleAlert } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

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
	const { mutate: mutateUpload } = useUpload('upload-slip');
	const [requestSuccess, setRequestSuccess] = useState(false);
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
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setError(null);
		setRequestSuccess(false);

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
			onSuccess: () => {
				clearState();
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

					{(!imageFile && !imagePath) && (
						<div className="flex flex-col justify-center items-center text-sm">
							<CloudUpload className="w-12 h-12 mx-auto text-blue-800 mb-4" />
							<p className="text-blue-900 font-medium mb-2">คลิกเลือกรูปหรือลากวาง</p>
							<p className="text-sm text-blue-900">รองรับไฟล์นามสกุล JPG, PNG, GIF, WEBP (ขนาดไม่เกิน 1MB)</p>
						</div>
					)}

					{(imageFile || imagePath) && (
						<div className="relative">
							<div className="flex items-center justify-center">
								{getFilePreview()}
							</div>
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
		</div>
	);
};

export default UploadSlip;
