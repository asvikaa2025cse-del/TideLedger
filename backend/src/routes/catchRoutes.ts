import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateTrustScore } from '../lib/trust.js';
import { distanceBetween } from '../lib/geography.js';

const router = Router();

const catchSchema = z.object({
  speciesId: z.string(),
  quantity: z.number().positive(),
  unit: z.string().default('kg'),
  catchDate: z.string().or(z.date()),
  locationLat: z.number(),
  locationLng: z.number(),
  fishingZone: z.string().optional(),
  notes: z.string().optional(),
});

router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { fisher: true } });

  const where = req.user!.role === 'ADMIN' ? {} : { fisherId: user?.fisher?.id ?? '' };

  const catches = await prisma.catchBatch.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { species: true, fisher: { include: { user: true } } },
  });

  return res.json({ success: true, data: catches });
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const payload = catchSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { fisher: true } });
    if (!user?.fisher) {
      return res.status(403).json({ success: false, error: { code: 'FISHER_REQUIRED', message: 'Only fishers can record catches.' } });
    }

    const species = await prisma.species.findUnique({ where: { id: payload.speciesId } });
    if (!species) {
      return res.status(404).json({ success: false, error: { code: 'SPECIES_NOT_FOUND', message: 'Species was not found.' } });
    }

    const currentSeason = await prisma.season.findFirst({ where: { active: true } });
    const quota = await prisma.quota.findFirst({
      where: { speciesId: species.id, seasonId: currentSeason?.id ?? '' },
      orderBy: { createdAt: 'desc' },
    });

    const quotaRemaining = quota ? quota.totalQuota - quota.consumed : Number.MAX_SAFE_INTEGER;
    const zone = await prisma.zone.findFirst({ where: { status: 'ACTIVE' } });
    const isAllowedZone = zone ? true : false;

    const duplicate = await prisma.catchBatch.findFirst({
      where: { fisherId: user.fisher.id, speciesId: species.id },
      orderBy: { createdAt: 'desc' },
    });

    const duplicateDetected = Boolean(
      duplicate &&
      duplicate.quantity === payload.quantity &&
      duplicate.locationLat !== null &&
      payload.locationLat &&
      distanceBetween({ lat: payload.locationLat, lng: payload.locationLng }, { lat: duplicate.locationLat!, lng: duplicate.locationLng! }) < 0.5,
    );

    const quotaValid = payload.quantity <= quotaRemaining;
    const quantityNormal = payload.quantity < 1500;
    const temporalPlausible = new Date(payload.catchDate).getTime() <= Date.now();
    const weatherPlausible = true;
    const priorViolations = await prisma.violation.count({ where: { fisherId: user.fisher.id } });
    const trust = calculateTrustScore({
      gpsValid: !!payload.locationLat && !!payload.locationLng,
      zoneAllowed: isAllowedZone,
      quotaValid,
      quantityNormal,
      temporalPlausible,
      weatherPlausible,
      duplicateDetected,
      priorViolations,
    });

    const status = quotaValid && isAllowedZone && !duplicateDetected ? 'SYNCED' : 'RESTRICTED';
    const token = `TL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000) + 1).padStart(6, '0')}`;

    const created = await prisma.catchBatch.create({
      data: {
        fisherId: user.fisher.id,
        speciesId: species.id,
        quantity: payload.quantity,
        unit: payload.unit,
        catchDate: new Date(payload.catchDate),
        locationLat: payload.locationLat,
        locationLng: payload.locationLng,
        fishingZone: payload.fishingZone ?? zone?.name ?? 'North Coast',
        notes: payload.notes ?? '',
        status,
        trustScore: trust.score,
        trustStatus: trust.status as any,
        qrCodeToken: token,
        syncStatus: 'SYNCED',
      },
    });

    await prisma.trustRuleResult.createMany({
      data: trust.rules.map((rule) => ({
        catchId: created.id,
        rule: rule.rule,
        contribution: rule.contribution,
        status: rule.status,
        explanation: rule.explanation,
      })),
    });

    const previousHash = crypto.createHash('sha256').update(created.id + 'seed').digest('hex');
    const eventHash = crypto.createHash('sha256').update(`${created.id}:${status}:${trust.score}`).digest('hex');

    await prisma.traceabilityEvent.create({
      data: {
        catchId: created.id,
        eventType: 'CATCH_CREATED',
        description: 'Catch batch was recorded and verified.',
        previousHash,
        eventHash,
      },
    });

    if (trust.status !== 'VERIFIED' || !quotaValid || duplicateDetected) {
      await prisma.violation.create({
        data: {
          fisherId: user.fisher.id,
          catchId: created.id,
          type: duplicateDetected ? 'DUPLICATE_SUBMISSION' : 'RESTRICTED_ZONE',
          severity: 'WARNING',
          status: 'OPEN',
          description: duplicateDetected ? 'Duplicate or suspicious catch submission detected.' : 'Catch requires review due to compliance or zone issues.',
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Catch recorded',
        message: `Your catch of ${species.commonName} was registered with a trust score of ${trust.score}.`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CATCH_CREATED',
        entity: 'catch_batch',
        entityId: created.id,
        metadata: JSON.stringify({ species: species.commonName, trustStatus: trust.status }),
      },
    });

    return res.status(201).json({ success: true, data: { catchBatch: created, trust } });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message || 'Invalid catch record.' } });
  }
});

export default router;
