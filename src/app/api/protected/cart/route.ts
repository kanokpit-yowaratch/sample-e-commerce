import prisma from '@/lib/prisma';
import { cartSchema } from '@/lib/schemas/cart-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = cartSchema.parse(body); const user = await prisma.user.findFirst({
      where: {
        email: data.userEmail,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const userId = user.id;
    const totalPrice = data.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    let cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    if (!cart) {
      // add new if no any active cart
      cart = await prisma.cart.create({
        data: {
          userId,
          status: 'ACTIVE',
          totalPrice,
        },
      });
    } else {
      // remove old cartItem
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    if (data.cart.items.length === 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      await prisma.cart.delete({
        where: { id: cart.id },
      });
    } else {
      // add new cartItem
      await prisma.cartItem.createMany({
        data: data.cart.items.map((item) => ({
          cartId: cart.id,
          productId: +item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      // update total price
      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid data or server error' }, { status: 400 });
  }
}
