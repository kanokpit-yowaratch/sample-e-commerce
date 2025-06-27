import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRoleId } from '@/lib/permission';
import { RoleIdMapType } from '@/types/permission';

export async function GET() {
  try {
    const session = await getSession();
    const roleId = getRoleId(session?.user.role as keyof RoleIdMapType);
    const userPermissions = await prisma.permission.findMany({
      select: {
        roleId: true,
        resource: true,
        action: true,
      },
      where: {
        roleId,
      }
    });
    return NextResponse.json(userPermissions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
