import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
	try {
		const session = await getSession();
		let userId = '';
		if (!session?.user.id) {
			throw new ApiError('User not found', 404);
		} else {
			const user = await prisma.user.findFirst({
				where: {
					email: session.user.email ?? '',
				},
			});
			if (user) {
				userId = user.id;
			}
		}
		const defaultAddress = await prisma.address.findFirst({
			select: {
				id: true,
				name: true,
				phone: true,
				address1: true,
				address2: true,
				city: true,
				province: true,
				zipcode: true,
			},
			where: {
				userId,
				// isDefault: true
			},
		});
		return Response.json(defaultAddress, { status: 200 });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	const { name, phone, address1, address2, city, province, zipcode, isDefault } = await req.json();
	try {
		const session = await getSession();
		let userId = '';
		if (!session?.user.id) {
			throw new ApiError('User not found', 404);
		} else {
			const user = await prisma.user.findFirst({
				where: {
					email: session.user.email ?? '',
				},
			});
			if (user) {
				userId = user.id;
			}
		}
		const addressUpdated = await prisma.address.create({
			data: {
				name,
				phone,
				address1,
				address2,
				city,
				province,
				zipcode,
				isDefault,
				userId,
			},
		});
		return Response.json(addressUpdated, { status: 201 });
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
