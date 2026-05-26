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

## Main Endpoints

```text
POST /api/auth/signup
POST /api/auth/signin
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
POST /api/knowledge/ask
GET  /api/progress
```

## Current Persistence

The first backend uses local JSON persistence through `TICHA_DATA_FILE`.

This keeps setup simple while preserving a clean boundary for replacing storage with Postgres, Supabase, or another database later.

## Production Checklist

- Set a strong `JWT_SECRET`.
- Use HTTPS only.
- Replace local JSON storage with a managed database.
- Add rate limits and abuse protection.
- Add email verification and password reset.
- Store uploaded media in object storage.
- Add provider-specific cost controls and safety filters.
