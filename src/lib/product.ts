import prisma from '@/lib/prisma';

// Helper function to get product with relations
export async function getProductById(id: number) {
	const product = await prisma.product.findUnique({
		where: { id },
	});
	return product;
}
