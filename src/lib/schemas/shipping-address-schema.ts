import { z } from 'zod';

export const shippingAddressSchema = z.object({
	name: z.string().max(125, 'Maximum 125 characters').optional(),
	phone: z.string().max(50, 'Phone max string 50 characters').optional(),
	address1: z.string().max(125, 'Maximum 125 characters'),
	address2: z.string().max(125, 'Maximum 125 characters').optional(),
	city: z.string().max(50, 'Maximum 50 characters').optional(),
	province: z.string().max(50, 'Maximum 50 characters').optional(),
	zipcode: z.string().max(5, 'Maximum 5 characters').optional(),
	isDefault: z.boolean().optional(),
});

export type ShippingAddressSchema = z.infer<typeof shippingAddressSchema>;
