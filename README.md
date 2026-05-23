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

This is a front-end prototype built as a standalone HTML app. Data is stored locally in the browser for now.

The app is ready for design review, product iteration, and API planning. Authentication, generated audio, AI content creation, cloud storage, and real learning analytics can be connected later.

## Project Structure

```text
TICHA/
├── README.md
├── CHANGELOG.md
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

Open `ticha_app.html` directly in a browser, or run a local server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/ticha_app.html
```

## Prototype Notes

- Local sign up and sign in are prototype-only and stored on the device.
- Vocabulary progress is stored locally.
- Starter vocabulary cards are included as sample learning content.
- Ticha Radio content is currently represented as prototype categories and sample copy.
- The word map feature is designed to later accept dynamic vocabulary data from an API.

## Roadmap

- Connect real authentication and cloud user profiles
- Add API-backed vocabulary generation and saved decks
- Add AI-generated word maps for each saved word
- Add generated audiobooks, podcasts, kids music, daily briefs, and bulletins
- Add real progress analytics and parent/family dashboards
- Package the app into a modern framework when ready for production

## Privacy And Security

This prototype does not include production authentication or server-side storage. Do not use real passwords or sensitive learner information until proper authentication, encryption, and backend storage are connected.

## Repository

GitHub: https://github.com/iam-askR/TICHA
