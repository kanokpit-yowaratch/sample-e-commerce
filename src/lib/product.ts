import prisma from '@/lib/prisma';

// Helper function to get product with relations
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
	});
	return product;
}

export const getProductsByCategory = async (categoryName: string) => {
	const products = await prisma.product.findMany({
		where: {
			category: {
				name: categoryName,
			},
		},
		include: {
			category: true,
			stocks: true,
			images: true,
		},
	});

	return products;
};
