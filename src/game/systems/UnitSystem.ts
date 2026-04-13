import type { Player } from '../entities/Player';
import type { Unit } from '../entities/Unit';
import type { Tile } from '../entities/Tile';
import { MovementSystem } from './MovementSystem';
import { distance, isSame } from '../entities/Position';

/* eslint-disable-next-line @typescript-eslint/no-extraneous-class */
export class UnitSystem {
  private constructor() {
    // Static utility class
  }

  static findNextAvailableUnit(
    player: Player,
    currentUnitId: string | null
  ): Unit | undefined {
    const availableUnits = player.units.filter((u) => u.movesRemaining > 0 && !u.isSkipping);
    if (availableUnits.length === 0) return undefined;

    const currentUnit = player.units.find((u) => u.id === currentUnitId);
    const firstAvailable = availableUnits[0];
    if (!firstAvailable) return undefined;
    if (!currentUnit) return firstAvailable;

    return availableUnits.reduce((prev, curr) => {
      if (isSame(curr.position, currentUnit.position)) {
        const currentIdx = player.units.indexOf(currentUnit);
        const nextSameTile = player.units
          .slice(currentIdx + 1)
          .find((u) => isSame(u.position, currentUnit.position) && u.movesRemaining > 0 && !u.isSkipping);
        if (nextSameTile) return nextSameTile;
      }

      const distPrev = distance(prev.position, currentUnit.position);
      const distCurr = distance(curr.position, currentUnit.position);

      if (isSame(curr.position, currentUnit.position)) return curr;
      if (isSame(prev.position, currentUnit.position)) return prev;

      return distCurr < distPrev ? curr : prev;
    }, firstAvailable);
  }

  static canMoveTo(unit: Unit, toX: number, toY: number, map: Tile[][]): boolean {
    const row = map[toY];
    const targetTile = row?.[toX];
    if (!targetTile) return false;
    const cost = MovementSystem.getMovementCost(unit, targetTile);
    return unit.movesRemaining >= cost;
  }
}
