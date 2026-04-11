# SKILLS — webcol

Use these pattern. Do not invent new pattern unless old one fail.

---

## EVENTBUS

File: `src/game/state/EventBus.ts`

Scene shout event.
React hear in `useEffect`.
React call store action.
Scene hear store by subscription.
No direct scene <-> React grab.

New event:
- add to `EventMap`
- use typed event
- no loose string event name all over cave

Smell:
- React import scene -> stop
- Scene call React code -> stop
- New event string outside `EventMap` -> stop

---

## SYSTEM

System pure TypeScript.
No Phaser.
No React.
No Zustand read inside.
Input in. plain data out.

Good:
```typescript
const result = CombatSystem.resolveCombat(attacker, defender, tile);
useGameStore.getState().applyResult(result);
```

Bad:
```typescript
class CombatSystem {
  resolve() {
    const state = useGameStore.getState();
  }
}
```

Smell:
- system import store/EventBus -> stop
- system touch DOM/window/document -> stop
- system need React/Phaser test -> stop

---

## ENTITY

Entity is plain data.
Use interface + factory.
No class instance.
Must be Immer-safe and JSON-safe.

Smell:
- constructor -> stop
- method on entity object -> stop
- entity import system/store/ui/scene -> stop

---

## STORE

Store hold serialisable data only.
No Phaser object.
No React ref.
No class instance.
Store validate input.
Heavy rule go system.

Smell:
- store calculate game rule blob -> move to system
- store keep framework object -> stop

---

## UI

Container read Zustand and pass prop down.
Present file render only.
Do not do both in one file when feature grow.
UI no Phaser.
UI no direct system call.
Tailwind first.

Smell:
- React file import Phaser -> stop
- React file import system -> stop
- component hide game rule in click handler -> stop

---

## CONSTANT

Magic number or string go `src/game/constants.ts`.

Smell:
- `if (population > 50)` -> bad
- hidden config string inline -> bad

---

## TEST

System test live next to system file.
Test system alone.
Pass plain data in.
Check plain data out.
No Phaser. No React. No store boot.

Smell:
- test need browser render for system -> stop
- new logic file with no test -> stop

---

## FOLDER

New feature get own folder.
Do not dump many files in old root pile.

Example:
```text
src/ui/TradePanel/
  TradePanel.tsx
  TradePanelContainer.tsx
  TradePanel.test.ts
```
