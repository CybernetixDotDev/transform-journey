# Akashic Library — Architecture Overview

## System Philosophy

Akashic Library is a structured progression engine with a symbolic interface.

Myth is presentation.
Logic is deterministic.

The architecture must:

- Be modular
- Be AI-ready
- Be backend-ready
- Avoid coupling UI to business logic

---

## High-Level Layers

Mobile UI (Expo / React Native)
        ↓
Application Logic Layer
        ↓
Domain Engine Layer
        ↓
Persistence Layer (AsyncStorage)
        ↓
(Future) AI Layer
        ↓
(Future) Backend Layer (Supabase)

---

## Core Modules

/src/domain
- types.ts
- archetypes.ts
- stats.ts
- rooms.ts
- bosses.ts

/src/engine
- SoulScanEngine.ts
- UnlockEngine.ts
- RitualEngine.ts
- BossEngine.ts
- QuestEngine.ts (static in V1)

/src/state
- usePlayerStore.ts

/src/storage
- persistence.ts

---

## Domain Model

PlayerState:
- archetype
- stats
- ascensionPoints
- unlockedRooms
- defeatedBosses
- ritualHistory

Archetype:
- id
- name
- statBias
- description

Room:
- id
- theme
- bossId
- requiredStatToUnlock

Boss:
- id
- requiredStats
- rewardXP

Stat:
- name
- currentValue (0–10)

---

## Engine Responsibilities

SoulScanEngine:
Maps answers → archetype + initial stat distribution.

UnlockEngine:
Determines when rooms unlock.

BossEngine:
Validates defeat conditions.

RitualEngine:
Handles stat increases and logging.

QuestEngine:
Static quest suggestions (AI-ready interface).

---

## AI-Ready Strategy

All AI-replaceable modules must follow interface boundaries.

Example:

QuestEngine.ts exports:

generateDailyQuest(playerState)

Later, replace internal logic with AI call.

UI never calls AI directly.

---

## Persistence Strategy

Zustand handles state in memory.

AsyncStorage persists PlayerState.

On app load:
- Rehydrate store
- Validate state
- Continue progression

---

## Future Extension Points

Phase 2:
- Replace static engines with AI-backed versions.

Phase 3:
- Add Supabase for authentication and cloud persistence.

Architecture is designed to avoid rewrite.