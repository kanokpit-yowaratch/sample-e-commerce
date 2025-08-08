import { updateCart, clearCart, syncCart } from '@/lib/cart';
import { ApiError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { cartSchema } from '@/lib/schemas/cart-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = cartSchema.parse(body);
    const user = await prisma.user.findFirst({
      where: {
        email: data.userEmail,
      },
    });
    if (!user) {
      throw new ApiError('Not Found user', 404);
    }
    const userId = user.id;
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });
    let cartWithImage;

    switch (data.mode) {
      case 'add':
      case 'update-quantity':
      case 'remove-item':
        await updateCart(data, cart, userId);
        return NextResponse.json({ success: true }, { status: 200 });
      case 'clear':
        await clearCart(cart);
        return NextResponse.json({ success: true }, { status: 200 });
      default:
        // Sync after login
        cartWithImage = await syncCart(data, userId);
        return NextResponse.json({ success: true, cartItems: cartWithImage }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Invalid data or server error' }, { status: 400 });
  }
}
