# Patient Activation Objectives Tracker

## Overview
A web application for tracking patient activation objectives. Built with React + Express, backed by Google Cloud BigQuery for data storage.

## Architecture
- **Frontend:** React + TypeScript with Tailwind CSS, shadcn/ui components, wouter routing, TanStack Query
- **Backend:** Express.js with REST API routes
- **Database:** Google Cloud BigQuery (not PostgreSQL/Drizzle)
- **Styling:** Tailwind v4 with Inter font, clean medical-grade aesthetic

## Key Files
- `shared/schema.ts` — Zod schemas for objectives (no Drizzle ORM since we use BigQuery)
- `server/bigquery.ts` — BigQuery client setup, table initialization
- `server/storage.ts` — IStorage interface implemented with BigQuery queries
- `server/routes.ts` — REST API endpoints (`/api/objectives`)
- `client/src/pages/home.tsx` — Main dashboard with objectives table, add/edit/delete

## Environment Variables
- `GCP_PROJECT_ID` — Google Cloud project ID (shared)
- `BIGQUERY_DATASET` — BigQuery dataset name, e.g. `activation_test` or `activation_prod` (shared)
- `GCP_SERVICE_ACCOUNT_KEY` — Service account JSON key (secret, for Replit dev only)

## Environment Switching
- **Development (Replit):** Uses `GCP_SERVICE_ACCOUNT_KEY` env var for authentication
- **Production (GCP):** Uses GCP Secret Manager + default service account (no key file needed)
- Dataset switching: Change `BIGQUERY_DATASET` between `activation_test` and `activation_prod`

## API Endpoints
- `GET /api/objectives` — List all objectives
- `GET /api/objectives/:id` — Get single objective
- `POST /api/objectives` — Create objective
- `PATCH /api/objectives/:id` — Update objective
- `DELETE /api/objectives/:id` — Delete objective

## Required GCP Roles for Service Account
- BigQuery Data Editor
- BigQuery Job User
