import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { checkUserExists } from '@/lib/user';

export async function GET() {
  try {
    const userData = await getSession();
    const existUser = await checkUserExists(userData?.user?.email ?? '');
    if (!existUser) {
      throw new ApiError('User not exists', 400);
    }
    const userId = existUser.id;

    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        shippingAddress: true,
        createdAt: true,
        updatedAt: true,
        orderPaymentHistory: {
          select: {
            id: true,
            paid_amount: true,
            status: true,
            created_at: true
          }
        }
      },
      where: {
        userId
      }
    });
    const result = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      shippingAddress: order.shippingAddress,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      paid_amount: order.orderPaymentHistory[0]?.paid_amount ?? 0
    }));
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json({ error: error.message }, { status: 500 });
    } else {
      return Response.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
