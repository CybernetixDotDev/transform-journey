# AGENTS.md

## Project
Akashic Library is an Expo / React Native app intended to evolve from a starter template into a guided progression experience.

## Architecture
Follow this layered structure:

- UI layer: Expo Router screens and presentational components
- State layer: Zustand store for player/app state
- Domain layer: core models, static content, and type definitions in `src/domain/*`
- Engine layer: progression and game logic in `src/engine/*`
- Persistence layer: AsyncStorage helpers in `src/storage/*`
- Future backend/AI layers may come later, but do not design around them yet

## Rules
- Keep business logic out of UI files
- UI should call store actions and engine functions, not implement progression rules directly
- Prefer small, readable modules over large abstract systems
- Keep the first implementation minimal and vertical
- Do not overengineer for future multiplayer, AI, or backend features yet

## Current repo reality
The running app is still largely an Expo starter template with tabs, modal, and themed wrapper components.
Core gameplay systems are incomplete or missing.

## First implementation target
Build the first real vertical slice with:

1. Zustand player state
2. AsyncStorage persistence and rehydration
3. Soul Scan flow
4. One playable room
5. One ritual completion flow
6. One boss/unlock path

## Expected file responsibilities
- `src/domain/*`: ids, types, room definitions, ritual definitions, boss definitions, archetypes
- `src/engine/*`: soul scan evaluation, unlock logic, boss challenge logic, progression helpers
- `src/state/usePlayerStore.ts`: central app/player state and actions
- `src/storage/persistence.ts`: load/save helpers for state persistence
- `app/*`: screens, navigation, and user flow wiring only

## Implementation style
- Use TypeScript consistently
- Prefer explicit types over clever inference when domain logic matters
- Add brief comments only where logic would otherwise be unclear
- Preserve Expo Router structure unless there is a strong reason to change it
- Keep naming aligned with the product docs where possible

## Working method
When given a task:
1. Inspect the repo and verify assumptions
2. Propose the smallest workable plan
3. Implement the change
4. Explain what changed and why
5. Flag anything that is still placeholder, incomplete, or risky