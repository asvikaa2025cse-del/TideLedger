import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/tideledger?schema=public',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  weatherApiKey: process.env.WEATHER_API_KEY ?? 'demo-key',
};
