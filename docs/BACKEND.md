# Ticha Backend

The backend is a TypeScript Express API designed so Ticha can run in mock mode now and switch to real providers when API values are added.

## Run Locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Health check:

```text
GET http://localhost:8787/api/health
```

## Provider Mode

Default mode is mock:

```env
AI_PROVIDER=mock
```

To use a real AI provider:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
OPENAI_MODEL=your-current-model
```

The frontend never receives secret API keys. It calls the backend, and the backend calls providers.

## Production Environment Values

Use these in Render or another backend host:

```env
NODE_ENV=production
PORT=8787
CORS_ORIGIN=https://your-ticha-frontend-url
APP_PUBLIC_URL=https://your-ticha-frontend-url
JWT_SECRET=use-a-long-random-secret

DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://...

AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=...

RESEND_API_KEY=re_...
EMAIL_FROM=Ticha <hello@your-domain.com>
SENTRY_DSN=https://...

STORAGE_PROVIDER=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=ticha-uploads
```

For Supabase, run `backend/migrations/001_initial_schema.sql` in the SQL editor or migration pipeline. Create a private storage bucket named `ticha-uploads`.

## Main Endpoints

```text
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/password/change
POST /api/auth/password/reset-request
POST /api/auth/password/reset-confirm
GET  /api/me
PATCH /api/me

GET  /api/vocabulary/starter
GET  /api/vocabulary
POST /api/vocabulary
PATCH /api/vocabulary/:wordId/review
GET  /api/vocabulary/:wordId/word-map

POST /api/capture/analyze
GET  /api/radio/categories
POST /api/radio/generate
POST /api/uploads/signed-url
POST /api/knowledge/ask
GET  /api/progress
```

## Current Persistence

The backend uses local JSON persistence through `TICHA_DATA_FILE` by default.

Set `DATABASE_PROVIDER=postgres` and `DATABASE_URL` to use Supabase Postgres.

## Production Checklist

- Set a strong `JWT_SECRET`.
- Use HTTPS only.
- Replace local JSON storage with a managed database.
- Connect password reset emails to an email provider.
- Add email verification.
- Store uploaded media in object storage.
- Add provider-specific cost controls and safety filters.
