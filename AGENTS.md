# AGENTS — webcol

Read this first. Then read `ARCHITECTURE.md`. Then read `SKILLS.md`.

---

## BIG RULE

First split by runtime. Then keep layer wall.

- Client: UI, Phaser scenes, client store, EventBus. No authority.
- Server: authority only. Own all game-changing command result.
- Shared domain: entity + system + protocol. Pure TypeScript only.

Inside shared game code keep four layer. No climb up.

- UI: read store. render only. no Phaser. no game rule.
- Scene: draw. input. no rule. talk by EventBus only.
- System: rule only. no Phaser. no React. no DOM. no store read inside.
- Entity: data only. plain object. no import from above.

If touched file break layer, fix now.
If scene do rule, move to system.
If component do rule, move to store or system.
If system need browser or Phaser to test, code wrong.
If client change world state direct, move to server command.
If server need EventBus, React, Phaser, Zustand, or DOM, code wrong.

---

## BEFORE HIT ROCK

1. Read file first.
2. Say clean-up plan, not only new thing plan.
3. Look for old bad code in touched file. Fix now.
4. Magic number or string go `src/shared/game/constants.ts`.
5. Touch system logic, add or update test.
6. One logical change per commit. Refactor separate from feature.
7. New game-changing action goes through shared command + server handler.

---

## KEEP CODE SMALL

- Same logic two place: extract now.
- Big class around 150+ line: split job.
- Dead code: delete.
- Commented code: delete.
- No test on tricky logic: add test before change.

If unsure, choose simple, typed, boring path.

---

## TYPE RULE

- No `any`.
- No `!`.
- Use `unknown` + guard when shape fuzzy.
- Use enum for domain value.
- Use `readonly` when data should not change after make.
- Public method and export need return type.
- New logic file needs next-to-file test.
- No `__tests__` folder.

Good:
`src/shared/game/systems/CombatSystem.ts` -> `src/shared/game/systems/CombatSystem.test.ts`

Good split:
`src/client/ui/*` -> client React UI
`src/client/scenes/*` -> client Phaser scenes
`src/client/game/*` -> client transport/store/view state/render glue
`src/server/game/*` -> authoritative command handling
`src/shared/game/*` -> protocol, entities, systems, constants

---

## NO

- No new package unless needed and explained.
- No `TODO`, `FIXME`, `HACK`.
- No `console.log`.
- No fake stub and call done.
- No copied commercial game text, art, audio, layout, numbers, formula.

If user ask copy copyrighted thing, stop and offer original version.
