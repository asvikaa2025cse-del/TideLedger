import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/overview', async (req: AuthenticatedRequest, res) => {
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin access required.' } });
  }

  const [totalFishers, activeFishers, totalCatch, totalSpecies, activeListings, pendingOrders, openViolations] = await Promise.all([
    prisma.fisher.count(),
    prisma.fisher.count({ where: { user: { status: 'ACTIVE' } } }),
    prisma.catchBatch.count(),
    prisma.species.count(),
    prisma.listing.count({ where: { status: 'ACTIVE' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.violation.count({ where: { status: 'OPEN' } }),
  ]);

  return res.json({
    success: true,
    data: { totalFishers, activeFishers, totalCatch, totalSpecies, activeListings, pendingOrders, openViolations },
  });
});

router.get('/fishers', async (req: AuthenticatedRequest, res) => {
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin access required.' } });
  }

  const fishers = await prisma.fisher.findMany({ include: { user: true, licenses: true } });
  return res.json({ success: true, data: fishers });
});

router.get('/violations', async (req: AuthenticatedRequest, res) => {
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin access required.' } });
  }

  const violations = await prisma.violation.findMany({ orderBy: { createdAt: 'desc' }, include: { fisher: { include: { user: true } } } });
  return res.json({ success: true, data: violations });
});

export default router;
