import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const listingSchema = z.object({
  speciesId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  quantity: z.number().positive(),
  pricePerKg: z.number().nonnegative(),
  freshness: z.string(),
  region: z.string().optional(),
  catchId: z.string().optional(),
});

router.get('/', async (_req, res) => {
  const listings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    include: { species: true, fisher: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ success: true, data: listings });
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const payload = listingSchema.parse(req.body);
    const fisher = await prisma.fisher.findUnique({ where: { userId: req.user!.id } });
    if (!fisher) {
      return res.status(403).json({ success: false, error: { code: 'FISHER_REQUIRED', message: 'Only a fisher can list catches.' } });
    }

    const listing = await prisma.listing.create({
      data: {
        fisherId: fisher.id,
        speciesId: payload.speciesId,
        title: payload.title,
        description: payload.description ?? '',
        quantity: payload.quantity,
        pricePerKg: payload.pricePerKg,
        freshness: payload.freshness,
        region: payload.region ?? fisher.fishingRegion ?? 'North Coast',
        catchId: payload.catchId ?? null,
      },
    });

    await prisma.notification.create({
      data: {
        userId: req.user!.id,
        title: 'Listing created',
        message: `Your listing for ${payload.title} is now live in the market.`,
      },
    });

    return res.status(201).json({ success: true, data: listing });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message || 'Invalid listing.' } });
  }
});

export default router;
