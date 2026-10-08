import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAuth, async (req: AuthenticatedRequest, res) => {
  const counts = {
    totalFishers: await prisma.fisher.count(),
    totalCatch: await prisma.catchBatch.count(),
    activeListings: await prisma.listing.count({ where: { status: 'ACTIVE' } }),
    pendingOrders: await prisma.order.count({ where: { status: 'PENDING' } }),
  };

  const catches = await prisma.catchBatch.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { species: true, fisher: { include: { user: true } } } });
  const listings = await prisma.listing.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { species: true } });

  return res.json({ success: true, data: { counts, catches, listings } });
});

router.get('/analytics', requireAuth, async (_req, res) => {
  const species = await prisma.species.findMany();
  const totals = await prisma.catchBatch.groupBy({ by: ['speciesId'], _sum: { quantity: true } });

  return res.json({ success: true, data: { species, totals } });
});

router.get('/weather', requireAuth, async (_req, res) => {
  const weather = await prisma.weatherRecord.findMany({ take: 10, orderBy: { timestamp: 'desc' } });
  return res.json({ success: true, data: weather });
});

router.get('/alerts', requireAuth, async (_req, res) => {
  const alerts = await prisma.alert.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  return res.json({ success: true, data: alerts });
});

router.get('/notifications/:userId', requireAuth, async (req, res) => {
  const userId = String(req.params.userId);
  const items = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ success: true, data: items });
});

export default router;
