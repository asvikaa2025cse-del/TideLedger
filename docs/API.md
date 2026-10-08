# TideLedger API Summary

## Public endpoints

- GET /health
- GET /api/public/traceability/:token

## Auth endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## Fisher and analytics endpoints

- GET /api/dashboard
- GET /api/analytics
- GET /api/weather
- GET /api/alerts
- GET /api/catches
- POST /api/catches

## Marketplace

- GET /api/listings
- POST /api/listings
- GET /api/orders
- POST /api/orders

## Admin

- GET /api/admin/overview
- GET /api/admin/fishers
- GET /api/admin/violations
- GET /api/species
- POST /api/species

## Security

- JWT bearer tokens are required for protected routes.
- Role checks are enforced on administrative and fisher endpoints.
- Hashing uses bcrypt.
