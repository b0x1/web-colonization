# SKILLS — webcol

Technical patterns for this codebase. Use these. Not invent own.

---

## EVENTBUS

File: `src/game/state/EventBus.ts`

Scene emit event. React subscribe in `useEffect`. React dispatch store action. Scene react to store subscription.
No direct cross-layer calls.

EventBus generic. `on<T>` infer callback type from call site.

```typescript
// subscribe
const unsub = eventBus.on<{ x: number; y: number }>('cameraJump', ({ x, y }) => { ... });
// cleanup
return () => unsub();

// emit
eventBus.emit('cameraJump', { x: 10, y: 20 });
```

New event → add to `EventMap` type in EventBus.ts. No string literal elsewhere.

---

## SYSTEM CLASS

Pure TypeScript. No Phaser. No React. No store read inside system.
Caller read state, pass in. System return plain data.

```typescript
// Good
const result = CombatSystem.resolveCombat(attacker, defender, tile);
useGameStore.getState().applyResult(result);

// Bad
class CombatSystem {
  resolve() {
    const state = useGameStore.getState(); // NO
  }
}
```

System must be testable with Vitest alone. No Phaser start. No React render.

---

## ENTITY PATTERN

Use interface + factory function. Not class with constructor.
Plain object. Immer-safe. JSON-serialisable.

```typescript
// Good
interface Settlement {
  readonly id: string;
  readonly position: { x: number; y: number };
  population: number;
}
function createSettlement(id: string, position: { x: number; y: number }): Settlement {
  return { id, position, population: 1 };
}

// Bad
class Settlement {
  constructor(public id: string) {} // Immer breaks class instances
}
```

---

## ZUSTAND STORE

Store hold serialisable data only. No Phaser object. No React ref. No class instance.
Store action do input validation then update state.
Complex logic → delegate to system class.

```typescript
// Good
addUnit: (unitData) => set(produce(state => {
  const unit = createUnit(unitData);
  state.units[unit.id] = unit;
})),

// Bad — logic in store
addUnit: (unitData) => set(produce(state => {
  if (state.units[unitData.id]) throw ...; // validation ok
  const stats = calculateBaseStats(unitData.type); // logic → move to system
})),
```

---

## REACT COMPONENT

Container: connect Zustand, pass props down. No render logic.
Presentational: receive props, render. No store access.
Never both. Never call system class direct.
Style with Tailwind only. No inline style. No `.css` class if Tailwind can do.

```typescript
// Container
function SettlementPanelContainer() {
  const settlement = useGameStore(s => s.selectedSettlement);
  return <SettlementPanel settlement={settlement} />;
}

// Presentational
function SettlementPanel({ settlement }: { settlement: Settlement }) {
  return <div className="p-4 bg-stone-800">...</div>;
}
```

---

## CONSTANTS

All magic numbers and config strings → `src/game/constants.ts`.

```typescript
// Bad
if (population > 50) { ... }

// Good
if (population > MAX_SETTLEMENT_POPULATION) { ... }
```

---

## TESTS

File `src/game/systems/CombatSystem.ts` → test at `src/game/systems/CombatSystem.test.ts`.
Test system in isolation. Pass plain data in. Assert plain data out.
No Phaser. No React. No store.

```typescript
describe('CombatSystem', () => {
  it('defender win on equal strength', () => {
    const result = CombatSystem.resolveCombat(attacker, defender, tile);
    expect(result.winner).toBe('defender');
  });
});
```

---

## NEW FEATURE FOLDER

New feature → new folder. Not dump files in root of existing dir.

```
src/ui/TradePanel/
  TradePanel.tsx
  TradePanelContainer.tsx
  TradePanel.test.ts
```
