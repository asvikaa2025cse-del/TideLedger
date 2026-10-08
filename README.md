# TideLedger

TideLedger is a fisheries resource management platform built for fishers, buyers, and administrators. It combines catch recording, quota tracking, explainable trust scoring, QR traceability, marketplace flows, and sustainability reporting in a single student-ready full-stack application.

## Product identity

TideLedger — “Every catch, with its story verified.”

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma ORM
- Auth: JWT + bcrypt
- Mapping: Leaflet + OpenStreetMap
- Charts: Recharts
- Testing: Vitest

## Project structure

```text
Fisheries/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── docs/
│   ├── API.md
│   └── Architecture.md
├── .env.example
├── docker-compose.yml
├── README.md
├── package.json
└── .gitignore
```

## Requirements

- Node.js 22+
- npm
- SQLite is used by default for local development

## Setup

1. Install dependencies:

```bash
cd Fisheries
npm install
```

2. Create the environment file if it does not already exist:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

3. Generate Prisma client, run migrations, and seed demo data:

```bash
cd Fisheries
npm --workspace backend run prisma:generate
npm --workspace backend run prisma:migrate
npm --workspace backend run seed
```

> The local database is SQLite. PostgreSQL and Docker are not required for this setup.

## Run the app

Backend:

```bash
cd Fisheries
npm --workspace backend run dev
```

Frontend:

```bash
cd Fisheries
npm --workspace frontend run dev
```

The backend runs on http://localhost:4000 and the frontend on http://localhost:5173.

## Demo users

- Admin: admin@tideledger.demo / Admin@123
- Fisher: fisher@tideledger.demo / Fisher@123
- Buyer: buyer@tideledger.demo / Buyer@123

## Verification page

Public QR verification uses:

```text
http://localhost:5173/verify/TL-2026-000001
```

## Testing

Run the backend trust-engine tests:

```bash
cd Fisheries
npm --workspace backend run test
```

Run both production builds:

```bash
cd Fisheries
npm --workspace backend run build
npm --workspace frontend run build
```

You can verify the live catch workflow from the terminal with:

```bash
curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"fisher@tideledger.demo","password":"Fisher@123"}'
```

After login, use the returned token for authenticated requests to `/api/catches`.

## Feature highlights

- Fisher catch entry with quota and zone checks
- Explainable rule-based catch trust engine
- QR-based public traceability verification
- Buyer marketplace with listing and order support
- Admin dashboard with totals and compliance indicators
- Offline-friendly catch flow and local draft UX
- Tamil/English UI-ready structure

## Known limitations

- The local environment uses SQLite. PostgreSQL is suitable for larger production deployments but is not required for this project.
- This implementation uses a rule-based trust engine rather than an ML model, which matches the project requirement.
