# Akashic Library — Project Context

## Product Summary

Akashic Library is a cinematic, symbolic mobile application for structured self-reflection and identity evolution.

It is not a therapy app.
It does not diagnose, treat, or provide medical or psychological advice.

The experience is mythic in presentation but deterministic in logic.

The system is a structured progression engine with a symbolic interface.

---

## V1 Scope (Locked)

V1 is intentionally reduced in scope.

V1 includes:

- 3 Rooms
- 3 Archetypes
- 5 Stats
- 1 Boss per Room
- 1 Daily Ritual type
- Static rule-based progression
- Offline persistence (AsyncStorage)
- No backend
- No real AI calls

V1 excludes:

- Dynamic AI generation
- Cloud sync
- Procedural maps
- Monetization
- Advanced animation polish

V1 success criteria:
A user can complete Soul Scan → receive archetype → enter room → complete ritual → increase stats → defeat boss → unlock next room → close and reopen app with progress intact.

---

## Architectural Principles

1. Static-first, AI-ready.
   All logic must work deterministically without AI.
   AI can later replace internal module implementations.

2. UI must not contain business logic.
   Domain and engine logic live outside screens.

3. Modules must be separable and testable.

4. Fixed map structure with rule-based personalized unlock order.

5. No therapy framing.
   All guidance must be reflective and symbolic.
   Never medical or diagnostic.

---

## Module Structure

Expected folder structure:

/src/domain
  types.ts
  archetypes.ts
  stats.ts
  rooms.ts
  bosses.ts

/src/engine
  SoulScanEngine.ts
  UnlockEngine.ts
  RitualEngine.ts
  BossEngine.ts
  QuestEngine.ts

/src/state
  usePlayerStore.ts

/src/storage
  persistence.ts

Screens must consume engine modules.
Screens must not implement progression logic directly.

---

## Safety Constraints

The application must:

- Avoid medical claims
- Avoid diagnosis
- Avoid trauma excavation
- Avoid dependency loops
- Avoid urgency manipulation
- Avoid framing itself as therapy

The tone is symbolic, grounded, and reflective.

---

## Development Strategy

Development phases:

Phase 1 — Core progression engine (static)
Phase 2 — Ritual and XP loop
Phase 3 — Cinematic polish
Phase 4 — AI augmentation
Phase 5 — Backend integration (Supabase)

Each phase must be independently functional.

---

## Operating Rule for AI Agents

When generating code:

- Always follow docs/V1_SCOPE.md
- Always follow docs/ARCHITECTURE.md
- Never expand scope without explicit instruction
- Prefer simplicity over abstraction
- Avoid premature optimization

This file is the single source of truth.