# Akashic Library — V1 Scope Definition

## Purpose of V1

V1 is not the full mythic universe.

V1 is a functional progression engine wrapped in a minimal symbolic interface.

The goal of V1 is to validate:

- Core stat progression
- Archetype assignment
- Room unlock logic
- Boss defeat mechanics
- Ritual completion loop
- Persistence (offline)
- Clean, scalable architecture

No AI dependency. No backend dependency.

---

## V1 Includes

### Rooms (3 total)
- Shadow Mirror Hall
- Hall of Echoes
- Scarcity Vault

Each room:
- 1 boss
- 1 stat theme
- 1 ritual type

---

### Archetypes (3 total)
- Warrior
- Seer
- Alchemist

Each archetype:
- Has stat bias
- Has flavor text
- Influences starting stat distribution

---

### Stats (5 total)
- Courage
- Clarity
- Compassion
- Discipline
- SelfWorth

Stats:
- Range: 0–10
- Increase via rituals + quests
- Used for boss thresholds and unlock logic

---

### Boss System
Each room has 1 boss.
Boss defeat requires:
- Minimum stat threshold
- Ritual completion

Boss defeat grants:
- Ascension Points (XP)
- Unlock next room

---

### Ritual Engine (Static)
- 1 daily ritual per room
- Guided reflection (non-therapeutic)
- Completion increases relevant stat

No AI generation in V1.

---

### Soul Scan (Static Logic)
- 5–8 fixed questions
- Maps to archetype
- Generates initial stat distribution
- Unlocks first room

Pure deterministic logic.

---

### Persistence
- AsyncStorage
- Stores PlayerState locally

No Supabase in V1.

---

## V1 Explicitly Excludes

- Dynamic AI dialogue
- Procedural map generation
- Cloud sync
- Multiplayer or comparison
- Advanced animations
- Monetization
- Therapy or diagnosis logic

---

## V1 Definition of Success

A user can:

1. Complete Soul Scan
2. Receive archetype
3. Enter first room
4. Complete ritual
5. Increase stats
6. Defeat boss
7. Unlock next room
8. Close app and return with progress intact

If this works, the engine works.