import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.max(125, 'Maximum 125 characters')
		.nonempty('Email is required'),
	password: z
		.string()
		.max(125, 'Maximum 125 characters')
		.nonempty('Password is required'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
