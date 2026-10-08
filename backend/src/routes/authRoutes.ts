import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['FISHER', 'BUYER']).default('FISHER'),
  fisherId: z.string().optional(),
  licenseNumber: z.string().optional(),
  fishingRegion: z.string().optional(),
  businessName: z.string().optional(),
});

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'USER_EXISTS', message: 'A user with that email already exists.' } });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone ?? null,
        passwordHash,
        role: data.role,
      },
    });

    if (data.role === 'FISHER') {
      await prisma.fisher.create({
        data: {
          userId: user.id,
          fisherId: data.fisherId ?? `FL-${Date.now()}`,
          licenseNumber: data.licenseNumber ?? `LIC-${Date.now()}`,
          fishingRegion: data.fishingRegion ?? 'North Coast',
        },
      });
    } else {
      await prisma.buyer.create({
        data: {
          userId: user.id,
          businessName: data.businessName ?? `${data.name}'s Business`,
        },
      });
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '7d' });

    return res.status(201).json({ success: true, data: { user: { ...user, passwordHash: undefined }, token } });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message || 'Invalid request.' } });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' } });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' } });
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '7d' });

    return res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message || 'Invalid request.' } });
  }
});

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      fisher: true,
      buyer: true,
    },
  });

  res.json({ success: true, data: user });
});

export default router;
