# Akashic Library

Akashic Library is an Expo / React Native V1 progression prototype for a guided symbolic journey through rooms, rituals, and reflection integrations.

The V1 build is intentionally deterministic: it does not use AI, network services, or random outcomes. Player progress is saved locally, and each step of the journey is driven by explicit domain data, engine helpers, and Zustand store actions.

## V1 Experience Flow

The current playable path is:

1. Home introduces the archive and starts the Soul Scan.
2. Soul Scan presents one question at a time and assigns an archetype plus starting stats.
3. The first room, Shadow Mirror Hall, unlocks.
4. Each room offers one ritual interaction with fixed choices and stat effects.
5. Ritual completion records the choice, updates stats, and returns the player to the room.
6. The room reflection becomes available when ritual and stat requirements are met.
7. The player integrates the reflection and receives XP.
8. Successful integration unlocks the next room when one exists.
9. The V1 path ends after Scarcity Vault and The Scarcity Beast, with no further room unlock.

Current V1 rooms:

- Shadow Mirror Hall
- Hall of Echoes
- Scarcity Vault

Current reflection encounters:

- The Ghost
- The Critic
- The Scarcity Beast

## Architecture Overview

The app is organized by responsibility:

- `app/*`: Expo Router screens and navigation wiring.
- `src/domain/*`: static content, ids, domain types, room definitions, ritual definitions, reflection definitions, stats, and archetypes.
- `src/engine/*`: deterministic gameplay logic, Soul Scan scoring, ritual effects, unlock checks, readiness checks, and reflection prompt selection.
- `src/state/usePlayerStore.ts`: Zustand player state, actions, transient result state, and persistence orchestration.
- `src/storage/*`: AsyncStorage load/save helpers.
- `src/ui/theme.ts`: shared V1 visual foundation.
- `src/test/*`: Vitest coverage for engine and store behavior.

Business logic should stay in `src/engine` and `src/state`. Screens should render state, call store actions, and use engine helpers for display-only readiness/prompt decisions.

## Reflection System

The player-facing system is reflection/integration based. The Ghost, The Critic, and The Scarcity Beast are inner reflections, not enemies.

Reflection definitions currently live in `src/domain/bosses.ts`. Internal naming still uses the earlier `boss` model for stability, but player-facing UI uses reflection language.

Each reflection can define:

- `title`
- `name`
- `description`
- `represents`
- `prompt`
- `promptVariants`
- `requiredStats`
- `rewardXP`

`ReflectionEngine` selects prompts deterministically from player state. Prompt variants can match on:

- archetype
- min/max stats
- integrated reflection count
- prior ritual choice memory
- repeated ritual choice patterns
- prior reflection integration memory

If no variant matches, the engine falls back to the base reflection prompt.

## Progression And Persistence

Progression is deterministic and stored in Zustand state, persisted with AsyncStorage.

`PlayerState` tracks:

- archetype
- stats
- ascension XP
- unlocked rooms
- integrated reflections via the legacy `defeatedBosses` field
- ritual history
- ritual choice memory
- reflection integration memory

Transient result state is stored separately for UI flows:

- `lastRitualResult`
- `lastBossResult`

These result objects support result screens without changing the durable progression model.

## Test Coverage

The test suite currently focuses on deterministic engine/store behavior rather than UI rendering.

Covered areas include:

- Soul Scan archetype/stat/first-room output
- ritual stat effects and ritual history
- reflection readiness checks
- first-room, second-room, and final-room progression
- XP rewards
- room unlock behavior
- final end-of-V1 state
- clearing transient result state without clearing durable progression
- deterministic reflection prompt selection
- memory recording and memory-influenced prompt selection

Run tests with:

```bash
npm test
```

In some sandboxed environments, Vitest may fail during config loading with `spawn EPERM` before tests run. That is an environment process-spawn restriction, not a gameplay test failure.

## Visual Direction

The V1 visual direction is a quiet cosmic archive:

- dark base
- soft glow accents
- restrained typography
- readable raised panels
- room-specific mood colors
- symbolic room and reflection imagery
- calm transition language around rituals and integrations

Shared theme tokens and reusable panel/button styles live in:

```text
src/ui/theme.ts
```

The first visual system is applied across:

- Home
- Map
- Soul Scan
- Room
- Ritual
- Ritual Result
- Reflection Encounter
- Reflection Result

## Running The App

Install dependencies:

```bash
npm install
```

Run on web:

```bash
npm run web
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run Expo in offline mode:

```bash
npm run start:offline
```

## Validation Commands

Typecheck:

```bash
npx tsc --noEmit
```

Lint:

```bash
npm run lint
```

Test:

```bash
npm test
```

## Current Limitations

- The V1 path is intentionally short and deterministic.
- Reflection internals still use legacy `boss` naming in types, engine names, route names, store fields, and asset paths.
- There is no AI-generated content yet.
- There is no backend or account sync.
- Progress is local to the device through AsyncStorage.
- UI tests are not yet implemented; current tests cover engines and store logic.
- The asset library contains more rooms/reflections than the V1 loop currently uses.

## Recommended Next Evolution

Near-term product polish:

- Add a small reusable UI component layer for `Screen`, `Panel`, `Button`, and stat rows once the visual system stabilizes.
- Review mobile layouts with long copy and smaller device heights.
- Persist and display the exact selected reflection prompt in the result flow when needed.
- Add lightweight UI smoke tests for the primary journey screens.

Architecture cleanup:

- Plan a focused internal naming migration from `boss` to `reflection`:
  - `BossId` -> `ReflectionId`
  - `BossDefinition` -> `ReflectionDefinition`
  - `BossEngine` -> reflection readiness/integration engine
  - `defeatBoss` -> `integrateReflection`
  - `defeatedBosses` -> `integratedReflections`
  - `lastBossResult` -> `lastReflectionResult`
  - `app/bosses/[id].tsx` -> `app/reflections/[id].tsx`

Content/system evolution:

- Expand beyond the three-room V1 loop.
- Add more authored prompt variants and memory conditions.
- Introduce AI-generated prompts behind a feature flag, using the deterministic `ReflectionEngine` output as fallback.
- Keep generated prompts persisted per encounter so the user experience remains stable between renders.
