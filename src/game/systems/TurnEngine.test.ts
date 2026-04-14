import { describe, it, expect } from 'vitest';
import { TurnEngine } from './TurnEngine';
import { AISystem } from './AISystem';
import { createPlayer } from './../entities/Player';
import { createTile } from './../entities/Tile';
import { createSettlement } from './../entities/Settlement';
import { createUnit } from './../entities/Unit';
import { TerrainType, GoodType, UnitType, JobType, Nation } from './../entities/types';

import type { Tile } from '../entities/Tile';

describe('TurnEngine', () => {
  const createMap = (width: number, height: number): Tile[][] => {
    const map: Tile[][] = [];
    for (let y = 0; y < height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < width; x++) {
        row.push(createTile(`${x}-${y}`, x, y, TerrainType.GRASSLAND, 1));
      }
      map.push(row);
    }
    return map;
  };

  describe('runProduction', () => {
    it('should calculate food based on workforce and population consumption', () => {
      const player = createPlayer('p1', 'Player 1', true, 0, Nation.FRANCE);
      const settlement = createSettlement('c1', 'p1', 'Settlement 1', 2, 2, 1, 'EUROPEAN', 'STATE');
      const unit = createUnit('u1', 'p1', 'Test Unit', UnitType.COLONIST, 2, 2, 1);
      settlement.units.push(unit);
      settlement.workforce.set(unit.id, JobType.FARMER);
      player.settlements.push(settlement);

      const { players: updatedPlayers } = TurnEngine.runProduction([player], [], {}, () => 0.5, (p) => `${p}-test`);
      const updatedSettlement = updatedPlayers[0]?.settlements[0];
      if (!updatedSettlement) throw new Error('Settlement not found');

      // Farmer produces 3 FOOD.
      // Pop 1 consumes 2 FOOD.
      // Net = 1 FOOD.
      expect(updatedSettlement.inventory.get(GoodType.FOOD)).toBe(1);
    });
  });

});
