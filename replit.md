# Patient Activation Objectives Tracker

## Overview
A web application for tracking patient activation objectives. Built with React + Express, backed by Google Cloud BigQuery for data storage. Deployable to GCP Cloud Run.

## Architecture
- **Frontend:** React + TypeScript with Tailwind CSS, shadcn/ui components, wouter routing, TanStack Query
- **Backend:** Express.js with REST API routes
- **Database:** Google Cloud BigQuery (not PostgreSQL/Drizzle)
- **Deployment:** Docker container → GCP Cloud Run via Cloud Build
- **Styling:** Tailwind v4 with Inter font, clean medical-grade aesthetic

## Key Files
- `shared/schema.ts` — Zod schemas for objectives (no Drizzle ORM since we use BigQuery)
- `server/bigquery.ts` — BigQuery client setup, table initialization, supports ADC + service account key
- `server/storage.ts` — IStorage interface implemented with BigQuery queries
- `server/routes.ts` — REST API endpoints (`/api/objectives`)
- `client/src/pages/home.tsx` — Main dashboard with objectives table, add/edit/delete
- `Dockerfile` — Multi-stage Docker build for production
- `cloudbuild.yaml` — GCP Cloud Build config for automated CI/CD
- `.dockerignore` — Files excluded from Docker build

## Environment Variables
- `GCP_PROJECT_ID` — Google Cloud project ID (shared)
- `BIGQUERY_DATASET` — BigQuery dataset name, e.g. `activation_test` or `activation_prod` (shared)
- `GCP_SERVICE_ACCOUNT_KEY` — Service account JSON key (secret, for Replit dev only; not needed on GCP)

## Environment Switching
- **Development (Replit):** Uses `GCP_SERVICE_ACCOUNT_KEY` env var for authentication
- **Production (GCP Cloud Run):** Uses Application Default Credentials (ADC) automatically
- Dataset switching: Change `BIGQUERY_DATASET` between `activation_test` and `activation_prod`

## API Endpoints
- `GET /api/objectives` — List all objectives
- `GET /api/objectives/:id` — Get single objective
- `POST /api/objectives` — Create objective
- `PATCH /api/objectives/:id` — Update objective
- `DELETE /api/objectives/:id` — Delete objective

## GCP Deployment
1. Push code to GitHub
2. Connect repo to GCP Cloud Build (trigger on push to main)
3. Cloud Build uses `cloudbuild.yaml` to build Docker image and deploy to Cloud Run
4. Cloud Run service account needs: BigQuery Data Editor, BigQuery Job User
5. Environment vars set in cloudbuild.yaml: GCP_PROJECT_ID, BIGQUERY_DATASET=activation_prod

## Required GCP Roles for Service Account
- BigQuery Data Editor
- BigQuery Job User
