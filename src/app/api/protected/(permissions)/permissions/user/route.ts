import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRoleId } from '@/lib/permission';
import { RoleIdMapType } from '@/types/permission';
import { ApiError } from '@/lib/errors';

export async function GET() {
	try {
		const session = await getSession();
		const roleId = getRoleId(session?.user.role as keyof RoleIdMapType);
		if (roleId) {
			const userPermissions = await prisma.permission.findMany({
				select: {
					roleId: true,
					resource: true,
					action: true,
				},
				where: {
					roleId,
				},
			});
			return Response.json(userPermissions, { status: 200 });
		} else {
			return Response.json([], { status: 200 });
		}
	} catch (error) {
		if (error instanceof ApiError) {
			return Response.json({ message: error.message }, { status: error.statusCode });
		}
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
