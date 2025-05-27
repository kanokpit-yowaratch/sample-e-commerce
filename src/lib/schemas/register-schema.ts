import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
	name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
	phone: z.string().max(50, 'Phone max string 50 characters').optional(),
	role: z.nativeEnum(Role).optional(),
});
