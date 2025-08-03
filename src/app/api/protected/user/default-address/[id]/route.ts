import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { IdParamProps } from '@/types/common';
import { getSession } from '@/lib/auth';

// Get Single Address
export async function GET(req: NextRequest, { params }: IdParamProps) {
  const { id } = await params;
  try {
    console.log(id);
    return NextResponse.json({ id }, { status: 200 },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Update Address
export async function PUT(req: NextRequest, { params }: IdParamProps) {
  const { id } = await params;
  const addrId = parseInt(id);
  // const { name, description, price, categoryId } = await req.json();

  try {
    console.log(addrId);
    return NextResponse.json({ addrId }, { status: 200 });
  } catch (error) {
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

// Update Address some fields
export async function PATCH(req: Request, { params }: IdParamProps) {
  const { id } = await params;
  const body = await req.json();
  try {
    const session = await getSession();
    if (!session?.user.id) {
      throw new ApiError('User not found', 404);
    }
    const addrId = parseInt(id);
    const updateData: Prisma.AddressUpdateInput = {};
    if (body.name !== undefined) {
      updateData.name = body.name;
    }
    if (body.phone) {
      updateData.phone = body.phone;
    }
    if (body.address1) {
      updateData.address1 = body.address1;
    }
    if (body.address2) {
      updateData.address2 = body.address2;
    }
    if (body.city) {
      updateData.city = body.city;
    }
    if (body.province) {
      updateData.province = body.province;
    }
    if (body.zipcode) {
      updateData.zipcode = body.zipcode;
    }
    if (body.isDefault) {
      updateData.isDefault = body.isDefault;
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }
    const updateOrder = await prisma.address.update({
      where: { id: addrId },
      data: updateData,
    });
    return Response.json(updateOrder, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete Address
export async function DELETE(req: NextRequest, { params }: IdParamProps) {
  const { id } = await params;
  const addrId = parseInt(id);

  try {
    await prisma.address.delete({
      where: { id: addrId },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
