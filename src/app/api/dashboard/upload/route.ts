import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { ImageType, ProductImage } from '@prisma/client';
import { getProductById } from '@/lib/product';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get('file') as File;
	const pId = formData.get('productId') as string;
	const imgType = formData.get('imageType') as string;
	const productId = parseInt(pId);

	try {
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

		const product = await getProductById(productId);
		if (!product) {
			throw new ApiError('Not Found product', 404);
		}

		const imageType = imgType === 'cover' ? ImageType.cover : ImageType.thumbnail;

		const oldCover = await prisma.productImage.findFirst({
			where: { productId, imageType },
		});
		if (oldCover) {
			await prisma.productImage.delete({
				where: { id: oldCover.id },
			});
		}

		const pImage: ProductImage = await prisma.productImage.create({
			data: {
				productId,
				filePath: `${data.data.url}`,
				imageType,
			},
		});

		return NextResponse.json({ data: pImage }, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return NextResponse.json({ message: error.message }, { status: error.statusCode });
		}
		return NextResponse.json({ Message: 'Failed to upload image', status: 500 });
	}
}
