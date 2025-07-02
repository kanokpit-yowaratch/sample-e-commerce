import { z } from 'zod';

export const cartSchema = z.object({
  mode: z.string().optional(),
  userEmail: z.string(),
  cart: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
    )
  }),
});
