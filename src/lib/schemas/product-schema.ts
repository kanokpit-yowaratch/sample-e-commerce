import { z } from 'zod';

export const productSchema = z.object({
	name: z.string().min(3, 'Title must be at least 3 characters'),
	description: z.string(),
	price: z.number().min(1),
	categoryId: z.number().min(1),
});

export type ProductSchema = z.infer<typeof productSchema>;
