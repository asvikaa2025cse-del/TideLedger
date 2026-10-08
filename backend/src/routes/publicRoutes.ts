import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/traceability/:token', async (req, res) => {
  const batch = await prisma.catchBatch.findUnique({
    where: { qrCodeToken: req.params.token },
    include: {
      species: true,
      fisher: { include: { user: true } },
      traceabilityEvents: true,
      trustRuleResults: true,
    },
  });

  if (!batch) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Batch could not be verified.' } });
  }

  return res.json({
    success: true,
    data: {
      qrCodeToken: batch.qrCodeToken,
      species: batch.species.commonName,
      catchDate: batch.catchDate,
      fishingZone: batch.fishingZone,
      status: batch.status,
      trustStatus: batch.trustStatus,
      quantity: batch.quantity,
      fisherName: batch.fisher.user.name,
      traceabilityEvents: batch.traceabilityEvents,
      trustRuleResults: batch.trustRuleResults,
    },
  });
});

export default router;
