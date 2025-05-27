import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.email('Invalid email address')
		.min(9, 'Minimum 9 characters') // abc@de.fg
		.max(125, 'Maximum 125 characters')
		.nonempty('Email is required'),
	password: z
		.string()
		.min(8, 'Minimum 8 characters')
		.max(125, 'Maximum 125 characters')
		.nonempty('Password is required'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
