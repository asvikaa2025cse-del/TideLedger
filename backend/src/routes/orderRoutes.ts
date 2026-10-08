import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const orderSchema = z.object({
  listingId: z.string(),
  quantity: z.number().positive(),
});

router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const buyer = await prisma.buyer.findUnique({ where: { userId: req.user!.id } });
  if (!buyer) {
    return res.json({ success: true, data: [] });
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: buyer.id },
    include: { items: { include: { listing: { include: { species: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: orders });
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const payload = orderSchema.parse(req.body);
    const buyer = await prisma.buyer.findUnique({ where: { userId: req.user!.id } });
    if (!buyer) {
      return res.status(403).json({ success: false, error: { code: 'BUYER_REQUIRED', message: 'Only buyers can place orders.' } });
    }

    const listing = await prisma.listing.findUnique({ where: { id: payload.listingId }, include: { species: true, fisher: { include: { user: true } } } });
    if (!listing) {
      return res.status(404).json({ success: false, error: { code: 'LISTING_NOT_FOUND', message: 'Listing was not found.' } });
    }

    if (payload.quantity > listing.quantity) {
      return res.status(400).json({ success: false, error: { code: 'ORDER_QUANTITY_EXCEEDED', message: 'Order quantity exceeds available stock.' } });
    }

    const order = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        fisherId: listing.fisherId,
        status: 'PENDING',
        totalAmount: listing.pricePerKg * payload.quantity,
        items: {
          create: [{
            listingId: listing.id,
            quantity: payload.quantity,
            pricePerKg: listing.pricePerKg,
            subtotal: listing.pricePerKg * payload.quantity,
          }],
        },
      },
    });

    await prisma.listing.update({
      where: { id: listing.id },
      data: { quantity: listing.quantity - payload.quantity },
    });

    await prisma.notification.create({ data: { userId: listing.fisher.userId, title: 'New order', message: 'A buyer placed an order for one of your listings.' } });
    return res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message || 'Invalid order.' } });
  }
});

export default router;
