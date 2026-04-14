# Akashic Library

Akashic Library is an Expo / React Native V1 progression prototype built around a deterministic reflective journey.

## Current Flow

- Soul Scan assigns an archetype and opens the first room.
- Each room contains one ritual and one reflection integration.
- Progression is saved locally with AsyncStorage.
- Reflection prompts are deterministic and can respond to player stats, archetype, and memory.

## Development

```bash
npm install
npm start
```

Useful checks:

```bash
npm run lint
npx tsc --noEmit
npm test
```

## Architecture

- `app/*`: Expo Router screens and navigation wiring.
- `src/domain/*`: static gameplay content and domain types.
- `src/engine/*`: deterministic gameplay and reflection logic.
- `src/state/usePlayerStore.ts`: Zustand player state and actions.
- `src/storage/*`: AsyncStorage persistence.
- `src/ui/theme.ts`: shared V1 visual foundation.
