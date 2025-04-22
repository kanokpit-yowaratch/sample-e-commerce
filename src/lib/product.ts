import prisma from '@/lib/prisma';

// Helper function to get product by Id
export async function getProductById(id: number) {
	const product = await prisma.product.findUnique({
		where: { id },
	});
	return product;
}

// Helper function to get product by Name
export async function getProductByName(name: string) {
	const product = await prisma.product.findUnique({
		where: { name },
		include: {
			images: true,
		},
	});
	return product;
}

export const getProductsByCategory = async (categoryId: number) => {
	const products = await prisma.product.findMany({
		where: {
			category: {
				id: categoryId,
			},
		},
		include: {
			images: true,
		},
	});

	return products;
};
