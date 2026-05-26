# Ticha

Ticha is a premium English learning companion app prototype for learners and families. It is designed around a calm ivory, jade, and muted-gold interface with mobile-first learning flows.

The product direction is simple: help learners build English confidence through vocabulary, reading, listening, tests, and gentle progress tracking.

## Features

The app includes:

- Onboarding and language selection
- Account sign up and sign in prototype
- Mobile-first learning dashboard
- Vocabulary card deck with starter words
- Word map views for vocabulary understanding
- Ticha Radio listening hub
- Reading coach, weekly test, community, and profile screens
- Profile page with local learner details and vocabulary sharing QR area
- Starter content so new users can understand the experience before APIs are connected

## Current Status

The original standalone HTML prototype is preserved for review. A new React + Vite + TypeScript frontend scaffold now lives in `frontend/` so Ticha can move into API integration, component testing, and production-style deployment without losing the approved prototype.

Data is still local/mock for now. Authentication, generated audio, AI content creation, cloud storage, and real learning analytics can be connected through the typed API service layer.

## Project Structure

```text
TICHA/
├── README.md
├── CHANGELOG.md
├── docs/
│   └── API_ROLLOUT.md
├── backend/
│   ├── src/
│   │   ├── providers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── store/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── domain/
│   │   ├── services/
│   │   └── store/
│   ├── package.json
│   └── vite.config.ts
├── ticha_app.html
└── assets/
    ├── husky-card-reference.png
    ├── welcome-husky-card-clean.png
    ├── welcome-husky-card-clean-v2.png
    └── welcome-husky-reference.jpeg
```

## Design Direction

Ticha uses a premium education UI style:

- Warm ivory background
- Deep jade green for primary actions
- Muted gold for small accents
- Elegant serif typography for brand moments
- Clean sans-serif typography for app controls
- Rounded cards, thin borders, generous spacing, and soft shadows

## Run Locally

Open the legacy prototype directly in a browser, or run a local server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/ticha_app.html
```

Run the new React app:

```bash
cd frontend
npm install
npm run dev
```

Useful checks:

```bash
npm run build
npm test
npm run e2e
```

Run the backend API:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend health check:

```text
http://localhost:8787/api/health
```

Connect the React app to the backend by setting:

```bash
VITE_TICHA_API_URL=http://localhost:8787
```

## Prototype Notes

- Local sign up and sign in are prototype-only and stored on the device.
- Vocabulary progress is stored locally.
- Starter vocabulary cards are included as sample learning content.
- Ticha Radio content is currently represented as prototype categories and sample copy.
- The word map feature is designed to later accept dynamic vocabulary data from an API.
- The React app has a typed API client in `frontend/src/services/apiClient.ts` that can be swapped from local mock data to real backend calls.
- The backend has mock providers by default and an OpenAI-compatible provider mode when API values are supplied.
- The API rollout order is documented in `docs/API_ROLLOUT.md`.

## Roadmap

- Connect real authentication and cloud user profiles
- Add API-backed vocabulary generation and saved decks
- Add AI-generated word maps for each saved word
- Add generated audiobooks, podcasts, kids music, daily briefs, and bulletins
- Add real progress analytics and parent/family dashboards
- Replace the mock API client with real API endpoints
- Move GitHub Pages or Vercel deployment to the React build when ready

## Privacy And Security

This prototype does not include production authentication or server-side storage. Do not use real passwords or sensitive learner information until proper authentication, encryption, and backend storage are connected.

## Repository

GitHub: https://github.com/reubenask/TICHA

## Public Review Link

GitHub Pages review link:

```text
https://reubenask.github.io/TICHA/
```

Direct app link:

```text
https://reubenask.github.io/TICHA/ticha_app.html
```
