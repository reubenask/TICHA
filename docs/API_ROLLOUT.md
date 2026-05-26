# Ticha API Rollout Plan

This is the recommended order for connecting real services after the React foundation is in place.

## 1. Auth And Profiles

- Sign up, sign in, sign out, password reset.
- Store learner name, preferred language, level, and profile photo.
- Replace the local prototype profile in `frontend/src/services/apiClient.ts`.

## 2. Vocabulary

- Fetch starter decks from the backend.
- Save learner words and review status.
- Generate word maps from a vocabulary word object, not hardcoded content.

## 3. AI Learning

- Word search and knowledge answers.
- Photo/capture analysis.
- Reading coach text generation.
- Translation into the learner's registered language.

## 4. Ticha Radio

- Audiobooks: original short stories and bedtime stories.
- Podcasts: history, nature, science facts, fashion, and general knowledge.
- Kids Music: funny weekly songs, rhymes, and vocabulary songs.
- Daily Brief: original child-safe news briefing.
- Movie Brief: kid-safe character and story discussion.
- Breaking Bulletin: short “Did you know...” notifications.

## 5. Progress And Family

- Weekly test results.
- Mastery score and review scheduling.
- Parent/family account linking.
- Vocabulary sharing and QR import.

## Test Cases Before API Launch

- Account creation shows the registered learner name and ID.
- Sign in restores profile, language, level, photo, and vocabulary.
- Starter decks appear for brand-new users.
- Word map renders any word object with fallbacks for missing fields.
- Mobile viewport has no horizontal overflow at 375px.
- Inputs do not zoom or enlarge on iPhone focus.
- Ticha Radio categories load from API data and fail gracefully.
