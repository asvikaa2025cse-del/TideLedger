# TideLedger Architecture

The project follows a modular full-stack pattern with a React frontend and an Express + Prisma backend.

## Frontend

- Vite React app for the user experience
- Tailwind styling for a modern ocean-focused SaaS aesthetic
- Router-driven pages for landing, auth, fisher, buyer, and admin views
- API calls to the backend for authentication, analytics, catches, listings, and traceability

## Backend

- Express app with route modules and middleware
- Prisma schema provides the database contract
- JWT auth and RBAC checks on protected routes
- Trust engine computes deterministic, explainable catch scores
- QR traceability and traceability event logic provide public verification

## Data model

The database covers core fisheries entities:

- users, fishers, buyers
- species, seasons, zones, quotas
- catch batches and trust rule records
- listings, orders, and price history
- alerts, violations, notifications, audit logs
- resource pressure summary data

## Why this design

This keeps the project maintainable, easy for a student project to run, and realistic enough to showcase end-to-end functionality without unnecessary microservice complexity.
