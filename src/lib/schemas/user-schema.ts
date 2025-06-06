import { z } from 'zod';
import { roles } from '@/types/user';

export const userSchema = z.object({
	name: z
		.string()
		.max(125, 'Maximum 125 characters')
		.optional(),
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
	role: z.enum(roles),
	phone: z
		.string()
		.max(125, 'Maximum 125 characters')
		.optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
