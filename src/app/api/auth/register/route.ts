import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkUserExists, hashPassword } from '@/lib/user';
import { ApiError } from '@/lib/errors';
import { registerSchema } from '@/lib/schemas/register-schema';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
	try {
		const { email, password, name, phone, role } = await req.json();

		const validationResult = registerSchema.safeParse({ email, password, name, phone, role });
		if (!validationResult.success) {
			throw new ApiError('Invalid input', 400);
		}

		const existingUser = await checkUserExists(email);
		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: 'This email is already in use.',
				},
				{ status: 409 },
			);
		}

		const hashedPassword = await hashPassword(password);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				createdAt: new Date(),
				updatedAt: new Date(),
				role: Role.store,
			},
		});

		const response = {
			success: true,
			message: 'Create user authen successfully',
			user,
		};

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		console.error('Register error:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
			},
			{ status: 500 },
		);
	}
}
