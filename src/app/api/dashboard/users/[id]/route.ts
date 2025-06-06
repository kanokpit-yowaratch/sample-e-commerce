import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { IdParamProps } from '@/types/common';
import { getUserById } from '@/lib/user';

// Get Single User
export async function GET(req: NextRequest, { params }: IdParamProps) {
  const { id } = await params;
  try {
    const user = await getUserById(id);
    if (!user) {
      throw new ApiError('Not Found user', 404);
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Update User
export async function PUT(req: NextRequest, { params }: IdParamProps) {
  const { id } = await params;
  const { name, email, phone } = await req.json();

  try {
    const user = await getUserById(id);
    if (!user) {
      throw new ApiError('Not Found user', 404);
    }

    const userUpdate = await prisma.user.update({
      where: { id },
      data: { name, email, phone },
    });
    return NextResponse.json(userUpdate, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target;
      if (Array.isArray(target) && target.includes('name')) {
        return NextResponse.json({ message: 'This name is already in use.' }, { status: 400 });
      }
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Update User some fields
export async function PATCH(req: Request, { params }: IdParamProps) {
  try {
    const { name, phone, role } = await req.json();
    const { id } = await params;
    return Response.json(
      await prisma.user.update({
        where: { id },
        data: { name, phone, role },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete User
export async function DELETE(req: NextRequest, { params }: IdParamProps) {
  const { id } = await params;

  try {
    const user = await getUserById(id);
    if (!user) {
      throw new ApiError('Not Found user', 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
