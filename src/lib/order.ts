import { Order } from '@prisma/client';
import prisma from './prisma';

export async function getOrderById(id: number): Promise<Order | null> {
	return await prisma.order.findUnique({
		where: { id },
	});
}

export async function generateOrderNumber(): Promise<string> {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const prefix = `ORD${year}${month}${day}`

  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      orderNumber: 'desc'
    }
  })

  let sequence = 1
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-4))
    sequence = lastSequence + 1
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`
}

// Calculate tax (implement your logic)
// function calculateTax(subtotal: number): number {
//   const taxRate = 0.07 // 7% VAT
//   return subtotal * taxRate
// }
