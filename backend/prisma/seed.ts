import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.violation.deleteMany();
  await prisma.traceabilityEvent.deleteMany();
  await prisma.trustRuleResult.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.catchBatch.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.weatherRecord.deleteMany();
  await prisma.quota.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.season.deleteMany();
  await prisma.species.deleteMany();
  await prisma.license.deleteMany();
  await prisma.fisher.deleteMany();
  await prisma.buyer.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const fisherPassword = await bcrypt.hash('Fisher@123', 10);
  const buyerPassword = await bcrypt.hash('Buyer@123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@tideledger.demo',
      passwordHash: adminPassword,
      name: 'Asha Reddy',
      phone: '9876543210',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const fisherUser = await prisma.user.create({
    data: {
      email: 'fisher@tideledger.demo',
      passwordHash: fisherPassword,
      name: 'Muthu Selvan',
      phone: '9123456780',
      role: 'FISHER',
      status: 'ACTIVE',
    },
  });

  const buyerUser = await prisma.user.create({
    data: {
      email: 'buyer@tideledger.demo',
      passwordHash: buyerPassword,
      name: 'Anitha Traders',
      phone: '9988776655',
      role: 'BUYER',
      status: 'ACTIVE',
    },
  });

  const fisher = await prisma.fisher.create({
    data: {
      userId: fisherUser.id,
      fisherId: 'FL-1001',
      licenseNumber: 'LIC-1001',
      fishingRegion: 'Palk Bay',
      trustScore: 88,
    },
  });

  const buyer = await prisma.buyer.create({
    data: {
      userId: buyerUser.id,
      businessName: 'BlueWave Sea Foods',
    },
  });

  const species = await Promise.all([
    prisma.species.create({ data: { commonName: 'Sardine', scientificName: 'Sardinella longiceps', regionalName: 'Mathi', category: 'pelagic', conservationStatus: 'Stable', defaultQuota: 12000, minimumLegalSize: 10, active: true } }),
    prisma.species.create({ data: { commonName: 'Mackerel', scientificName: 'Rastrelliger kanagurta', regionalName: 'Ayla', category: 'pelagic', conservationStatus: 'Stable', defaultQuota: 9000, minimumLegalSize: 12, active: true } }),
    prisma.species.create({ data: { commonName: 'Tuna', scientificName: 'Thunnus albacares', regionalName: 'Sura', category: 'large pelagic', conservationStatus: 'Watch', defaultQuota: 7000, minimumLegalSize: 18, active: true } }),
    prisma.species.create({ data: { commonName: 'Pomfret', scientificName: 'Pampus argenteus', regionalName: 'Vavval', category: 'demersal', conservationStatus: 'Stable', defaultQuota: 5000, minimumLegalSize: 15, active: true } }),
    prisma.species.create({ data: { commonName: 'Anchovy', scientificName: 'Engraulis encrasicolus', regionalName: 'Nethili', category: 'small pelagic', conservationStatus: 'Stable', defaultQuota: 8000, minimumLegalSize: 8, active: true } }),
    prisma.species.create({ data: { commonName: 'Prawn', scientificName: 'Penaeus monodon', regionalName: 'Era', category: 'shellfish', conservationStatus: 'Watch', defaultQuota: 4000, minimumLegalSize: 10, active: true } }),
  ]);

  const season = await prisma.season.create({
    data: {
      name: 'Monsoon Season',
      year: 2026,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-11-30'),
      active: true,
    },
  });

  const zones = await Promise.all([
    prisma.zone.create({ data: { name: 'North Coast', description: 'Coastal landing zone', status: 'ACTIVE', restrictions: 'Limited trawling', allowedSpecies: JSON.stringify(['Sardine', 'Mackerel', 'Anchovy']), polygon: JSON.stringify([{ lat: 8.2, lng: 77.5 }, { lat: 8.3, lng: 78.0 }, { lat: 8.7, lng: 78.1 }, { lat: 8.6, lng: 77.7 }]) } }),
    prisma.zone.create({ data: { name: 'Palk Bay', description: 'Protected shelf zone', status: 'ACTIVE', restrictions: 'No night trawling', allowedSpecies: JSON.stringify(['Tuna', 'Pomfret', 'Prawn']), polygon: JSON.stringify([{ lat: 9.1, lng: 78.8 }, { lat: 9.4, lng: 79.2 }, { lat: 9.8, lng: 79.3 }, { lat: 9.5, lng: 78.9 }]) } }),
    prisma.zone.create({ data: { name: 'Restricted Zone-A', description: 'Seasonal no-fishing area', status: 'RESTRICTED', restrictions: 'Closed for breeding season', allowedSpecies: JSON.stringify(['Sardine']), polygon: JSON.stringify([{ lat: 8.9, lng: 76.8 }, { lat: 9.2, lng: 77.5 }, { lat: 9.4, lng: 77.3 }, { lat: 9.1, lng: 76.7 }]) } })
  ]);

  await Promise.all([
    prisma.quota.create({ data: { speciesId: species[0].id, seasonId: season.id, zoneId: zones[0].id, totalQuota: 12000, consumed: 6000 } }),
    prisma.quota.create({ data: { speciesId: species[1].id, seasonId: season.id, zoneId: zones[0].id, totalQuota: 9000, consumed: 6200 } }),
    prisma.quota.create({ data: { speciesId: species[2].id, seasonId: season.id, zoneId: zones[1].id, totalQuota: 7000, consumed: 5100 } }),
    prisma.quota.create({ data: { speciesId: species[3].id, seasonId: season.id, zoneId: zones[1].id, totalQuota: 5000, consumed: 4200 } }),
  ]);

  const sampleCatch = await prisma.catchBatch.create({
    data: {
      fisherId: fisher.id,
      speciesId: species[0].id,
      quantity: 420,
      unit: 'kg',
      catchDate: new Date('2026-10-02T06:45:00Z'),
      locationLat: 8.45,
      locationLng: 77.82,
      fishingZone: 'North Coast',
      notes: 'Morning catch near reef edge.',
      status: 'SYNCED',
      trustScore: 91,
      trustStatus: 'VERIFIED',
      qrCodeToken: 'TL-2026-000001',
      syncStatus: 'SYNCED',
    },
  });

  await prisma.traceabilityEvent.createMany({
    data: [
      { catchId: sampleCatch.id, eventType: 'CATCH_CREATED', description: 'Catch batch was recorded', previousHash: 'seed-hash', eventHash: 'hash-1' },
      { catchId: sampleCatch.id, eventType: 'TRUST_VERIFIED', description: 'Trust engine verified the batch', previousHash: 'hash-1', eventHash: 'hash-2' },
      { catchId: sampleCatch.id, eventType: 'LISTED_FOR_SALE', description: 'Listing created for marketplace', previousHash: 'hash-2', eventHash: 'hash-3' },
    ],
  });

  const listing = await prisma.listing.create({
    data: {
      fisherId: fisher.id,
      speciesId: species[0].id,
      title: 'Fresh Sardine Catch',
      description: 'Freshly landed sardine under responsible harvest guidelines.',
      quantity: 250,
      pricePerKg: 140,
      freshness: 'High',
      region: 'Palk Bay',
      status: 'ACTIVE',
      catchId: sampleCatch.id,
    },
  });

  const order = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      fisherId: fisher.id,
      status: 'COMPLETED',
      totalAmount: 17500,
      items: {
        create: [{ listingId: listing.id, quantity: 125, pricePerKg: 140, subtotal: 17500 }],
      },
    },
  });

  await prisma.priceHistory.createMany({
    data: [
      { species: 'Sardine', region: 'Palk Bay', pricePerKg: 130, date: new Date('2026-09-15') },
      { species: 'Sardine', region: 'Palk Bay', pricePerKg: 136, date: new Date('2026-09-20') },
      { species: 'Sardine', region: 'Palk Bay', pricePerKg: 142, date: new Date('2026-09-25') },
      { species: 'Sardine', region: 'Palk Bay', pricePerKg: 148, date: new Date('2026-10-02') },
    ],
  });

  await prisma.weatherRecord.createMany({
    data: [
      { location: 'Palk Bay', temperature: 29.2, windSpeed: 14.5, rain: 1.2, condition: 'Sunny', timestamp: new Date('2026-10-02T06:00:00Z') },
      { location: 'North Coast', temperature: 27.8, windSpeed: 18.4, rain: 0.4, condition: 'Cloudy', timestamp: new Date('2026-10-03T06:00:00Z') },
    ],
  });

  await prisma.alert.createMany({
    data: [
      { userId: fisherUser.id, category: 'QUOTA', severity: 'WARNING', title: 'Quota near limit', message: 'You have used 82% of your sardine quota.', read: false },
      { userId: fisherUser.id, category: 'WEATHER', severity: 'INFO', title: 'Weather advisory', message: 'Wind speeds are elevated for the morning window.', read: false },
    ],
  });

  await prisma.violation.createMany({
    data: [
      { fisherId: fisher.id, catchId: sampleCatch.id, type: 'RESTRICTED_ZONE', severity: 'WARNING', status: 'OPEN', description: 'Catch was logged in a zone with seasonal restrictions.' },
      { fisherId: fisher.id, type: 'SUSPICIOUS_CATCH', severity: 'CRITICAL', status: 'REVIEW', description: 'Repeated catch pattern triggered manual review.' },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, action: 'LOGIN', entity: 'user', entityId: admin.id, metadata: JSON.stringify({ source: 'demo'}) },
      { userId: fisherUser.id, action: 'CATCH_CREATED', entity: 'catch_batch', entityId: sampleCatch.id, metadata: JSON.stringify({ species: 'Sardine' }) },
    ],
  });

  console.log('Seed data created successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
