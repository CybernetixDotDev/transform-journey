# AGENTS.md

## Project
Akashic Library is an Expo / React Native app for a guided reflective progression experience.

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
The running app now has a V1 deterministic gameplay loop with Soul Scan, rooms, rituals, reflection integrations, local persistence, and a first shared visual theme.
Some internal naming still uses `boss` terminology for stability even though player-facing copy uses reflection/integration language.

## Current implementation target
Keep productizing the V1 loop with:

1. Navigation polish
2. Visual consistency
3. Clear reflection/result flows
4. Small deterministic content improvements
5. Focused engine/store tests

## Expected file responsibilities
- `src/domain/*`: ids, types, room definitions, ritual definitions, boss definitions, archetypes
- `src/engine/*`: soul scan evaluation, unlock logic, boss challenge logic, progression helpers
- `src/state/usePlayerStore.ts`: central app/player state and actions
- `src/storage/persistence.ts`: load/save helpers for state persistence
- `app/*`: screens, navigation, and user flow wiring only
- `src/ui/theme.ts`: shared visual tokens and reusable styles

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
