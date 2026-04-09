# Architecture — webcol

Browser turn-based strategy game. Colonisation genre. See AGENTS.md for rules. See SKILLS.md for patterns.

---

## Stack

| Concern                         | Library           | Version |
|---------------------------------|-------------------|---------|
| Game render, input, scenes      | Phaser            | 3.90    |
| UI panels, modals, HUD          | React             | 19      |
| React optimisation              | React Compiler    | 1.x     |
| Phaser ↔ React state bridge     | Zustand           | 5       |
| Language                        | TypeScript strict | 6       |
| Styling                         | Tailwind CSS      | 4       |
| Build and dev server            | Vite              | 8       |
| Unit tests                      | Vitest            | 4       |
| Noise generation                | simplex-noise     | 4       |

---

## Layers

Depend only downward. No upward import.

```
┌──────────────────────────────────────────────┐
│  UI layer           src/ui/                  │
│  React + Tailwind. Read Zustand store.       │
│  No Phaser. No logic.                        │
├──────────────────────────────────────────────┤
│  Scene layer        src/scenes/              │
│  Phaser scenes. Render and input only.       │
│  No game rules. Talk via EventBus only.      │
├──────────────────────────────────────────────┤
│  Systems layer      src/game/systems/        │
│  All game rules. Pure TypeScript.            │
│  No Phaser. No React. No DOM.                │
│  Must be unit-testable alone.                │
├──────────────────────────────────────────────┤
│  Entity layer       src/game/entities/       │
│  Plain data interfaces and enums.            │
│  Zero dependencies.                          │
└──────────────────────────────────────────────┘
```

### Cross-layer talk

No direct calls between scenes and React. Two channels only:

- **EventBus** `src/game/state/EventBus.ts` — scene emit typed event, React subscribe in `useEffect`. All events in central `EventMap`.
- **Zustand store** `src/game/state/store.ts` — React read and dispatch actions, scene subscribe via `subscribe()`.

---

## File structure

```
public/
  assets/
    sprites/        Compiled sprite sheets (build:sprites output)
    maps/           Tiled map JSON
    audio/          Sound and music

src/
  scenes/           Phaser scenes only
  game/
    entities/       Data interfaces and enums — zero deps
    systems/        Game rule classes — no framework deps
    map/            Map generation and tile render helpers
    rendering/      Renderer sub-systems extracted from scenes
    state/
      EventBus.ts   Typed event bus
      store.ts      Zustand store — serialisable data only
    constants.ts    All magic numbers and config values
  ui/
    components/     Shared presentational components
    [FeatureName]/  One folder per modal or screen

data/
    sprites/        single SVG sprites - to generate sprite sheets

scripts/
  build-sprites.js  Prebuild: generate sprite sheets → public/assets/sprites/
```

---

## Build order

```
build:sprites   Sharp generate sprite sheets → public/assets/sprites/
tsc -b          TypeScript check
vite build      Bundle → dist/
```

`prebuild` hook run `build:sprites` before every production build.
CI run sprite build explicit first so tests can use generated assets.

---

## State ownership

| Data                              | Owner             |
|-----------------------------------|-------------------|
| Map, units, settlements           | Zustand store     |
| Turn state, resources, diplomacy  | Zustand store     |
| Phaser sprites and tweens         | Phaser scene only |
| Component local UI state          | React useState    |
| Cross-layer events                | EventBus          |

Store hold serialisable plain objects only. No Phaser instance. No React ref. No class instance.
Store stay snapshot-able for save/load. Stay inspectable in devtools.
