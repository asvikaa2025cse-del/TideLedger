import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const species = await prisma.species.findMany({ orderBy: { commonName: 'asc' } });
  return res.json({ success: true, data: species });
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Only admins can add species.' } });
  }

  const species = await prisma.species.create({
    data: {
      commonName: req.body.commonName ?? 'New Species',
      scientificName: req.body.scientificName ?? 'Unknown',
      regionalName: req.body.regionalName ?? '',
      category: req.body.category ?? 'Fish',
      conservationStatus: req.body.conservationStatus ?? 'Stable',
      defaultQuota: Number(req.body.defaultQuota ?? 1000),
      minimumLegalSize: Number(req.body.minimumLegalSize ?? 0),
      active: true,
    },
  });

  return res.status(201).json({ success: true, data: species });
});

export default router;
