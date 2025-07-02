import { Cart, CartItem } from '@prisma/client';
import prisma from './prisma';
import { CartSchema } from './schemas/cart-schema';

export async function updateCart(data: CartSchema, cart: Cart | null, userId: string) {
  const totalPrice = data.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let dbCart = cart;

  if (!dbCart) {
    dbCart = await prisma.cart.create({
      data: {
        userId,
        status: 'ACTIVE',
        totalPrice,
      },
    });
  } else {
    await prisma.cartItem.deleteMany({
      where: { cartId: dbCart.id },
    });
  }
  await addToCart(data, dbCart, totalPrice);
}

export async function addToCart(data: CartSchema, cart: Cart, totalPrice: number) {
  await prisma.cartItem.createMany({
    data: data.cart.items.map((item) => ({
      cartId: cart.id,
      productId: +item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  });
  await prisma.cart.update({
    where: { id: cart.id },
    data: { totalPrice },
  });
}

async function getCartItems(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cart: {
        userId,
        status: 'ACTIVE',
      },
    },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
  });

  const productCart = cartItems.map((item) => {
    return { id: item.productId, name: item.product.name, price: item.price, quantity: item.quantity };
  });
  return productCart;
}

export async function getCartItemsWithImage(cartItems: CartItem[]) {
  const cartWithImage = await Promise.all(
    cartItems.map(async (cartItem) => {
      const product = await prisma.product.findUnique({
        where: {
          id: cartItem.productId,
        },
        include: {
          images: true,
        },
      });
      return {
        id: cartItem.productId,
        name: product?.name ?? '',
        price: cartItem.price,
        quantity: cartItem.quantity,
        image: product?.images[0]?.filePath ?? '',
      };
    }),
  );
  return cartWithImage;
}

export async function clearCart(cart: Cart | null) {
  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    await prisma.cart.delete({
      where: { id: cart.id },
    });
  }
}

export async function syncCart(data: CartSchema, userId: string) {
  const currentCart = await prisma.cart.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
    },
  });

  if (data.cart.items.length !== 0) {
    const dbCartItems = await getCartItems(userId);
    const dbIds = dbCartItems.map((item) => item.id);
    const combined = [...data.cart.items, ...dbCartItems];
    const uniqueStrings = [...new Set(combined.map(obj => JSON.stringify(obj)))];
    const cartItems = uniqueStrings.map(str => JSON.parse(str));
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    let existCart = currentCart;

    if (existCart) {
      await prisma.cart.update({
        where: { id: existCart.id },
        data: { totalPrice },
      });
    } else {
      existCart = await prisma.cart.create({
        data: {
          userId,
          status: 'ACTIVE',
          totalPrice,
        },
      });
    }
    const cartId = existCart.id;

    // not found in DB, add new item
    cartItems.forEach(async (item) => {
      if (!dbIds.includes(item.id)) {
        await prisma.cartItem.create({
          data: {
            cartId,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }
    });

    const createdCartItems = await prisma.cartItem.findMany({
      where: {
        cartId,
      },
    });

    const cartWithImage = await getCartItemsWithImage(createdCartItems);
    return cartWithImage;
  } else {
    // localStorage was clear or expire
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: currentCart?.id,
      },
    });

    const cartWithImage = cartItems?.length > 0 ? await getCartItemsWithImage(cartItems) : [];
    return cartWithImage;
  }
}
