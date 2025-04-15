import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path, { join } from 'path';
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

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const fileExtension = path.extname(file.name);
		const fileName = `product-${Date.now()}${fileExtension}`;
		const filePath = join(process.cwd(), 'public/uploads', fileName);
		await writeFile(filePath, buffer);

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
				filePath: `/uploads/${fileName}`,
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
