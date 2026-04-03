import { describe, it, expect, vi } from 'vitest';
import { TurnEngine } from '../TurnEngine';
import { Player } from '../../entities/Player';
import { Tile } from '../../entities/Tile';
import { Colony } from '../../entities/Colony';
import { Unit } from '../../entities/Unit';
import { TerrainType, GoodType, UnitType } from '../../entities/types';

describe('TurnEngine', () => {
  const createMap = (width: number, height: number): Tile[][] => {
    const map: Tile[][] = [];
    for (let y = 0; y < height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new Tile(`${x}-${y}`, x, y, TerrainType.GRASSLAND, 1));
      }
      map.push(row);
    }
    return map;
  };

  describe('runProduction', () => {
    it('should calculate food based on population and surrounding terrain', () => {
      const map = createMap(5, 5);
      // Set some specific terrains around colony at (2,2)
      map[2][2].terrainType = TerrainType.PLAINS; // Colony tile
      map[1][2].terrainType = TerrainType.PLAINS;
      map[3][2].terrainType = TerrainType.OCEAN;
      map[2][1].terrainType = TerrainType.DESERT;
      map[2][3].terrainType = TerrainType.SWAMP;

      const player = new Player('p1', 'Player 1', true, 0);
      const colony = new Colony('c1', 'p1', 'Colony 1', 2, 2, 1);
      player.colonies.push(colony);

      const updatedPlayers = TurnEngine.runProduction([player], map);
      const updatedColony = updatedPlayers[0].colonies[0];

      // Food:
      // Population 1 -> 1 * 2 = 2 food
      // 9 tiles total:
      // PLAINS (2,2) -> 2 food
      // PLAINS (1,2) -> 2 food
      // OCEAN (3,2) -> 2 food
      // DESERT (2,1) -> 0 food (produces ORE)
      // SWAMP (2,3) -> 0 food (produces LUMBER)
      // Others (4 tiles) are GRASSLAND -> 4 * 3 = 12 food
      // Total food = 2 (pop) + 2 + 2 + 2 + 0 + 0 + 12 = 20
      expect(updatedColony.inventory.get(GoodType.FOOD)).toBe(20);
      expect(updatedColony.inventory.get(GoodType.ORE)).toBe(1);
      expect(updatedColony.inventory.get(GoodType.LUMBER)).toBe(1);
    });
  });

  describe('runAITurn', () => {
    it('should move AI unit toward nearest uncolonized target', () => {
      const map = createMap(10, 10);
      // All GRASSLAND by default
      // Set (5,5) as PLAINS (target)
      map[5][5].terrainType = TerrainType.PLAINS;

      const human = new Player('p1', 'Human', true, 0);
      const ai = new Player('p2', 'AI', false, 0);
      const unit = new Unit('u1', 'p2', UnitType.SOLDIER, 0, 0, 1);
      ai.units.push(unit);

      const updatedPlayers = TurnEngine.runAITurn([human, ai], map);
      const updatedUnit = updatedPlayers[1].units[0];

      // Unit should move from (0,0) towards (5,5)
      // One step diagonally towards (5,5) is (1,1)
      expect(updatedUnit.x).toBe(1);
      expect(updatedUnit.y).toBe(1);
      expect(updatedUnit.movesRemaining).toBe(0);
    });

    it('should found a colony if AI COLONIST is on PLAINS and no adjacent friendly colony', () => {
      const map = createMap(10, 10);
      map[2][2].terrainType = TerrainType.PLAINS;

      const ai = new Player('p1', 'AI', false, 0);
      const unit = new Unit('u1', 'p1', UnitType.COLONIST, 2, 2, 1);
      ai.units.push(unit);

      const updatedPlayers = TurnEngine.runAITurn([ai], map);
      const updatedAI = updatedPlayers[0];

      expect(updatedAI.colonies.length).toBe(1);
      expect(updatedAI.units.length).toBe(0);
      expect(updatedAI.colonies[0].x).toBe(2);
      expect(updatedAI.colonies[0].y).toBe(2);
    });

    it('should not found a colony if there is an adjacent friendly colony', () => {
        const map = createMap(10, 10);
        map[2][2].terrainType = TerrainType.PLAINS;

        const ai = new Player('p1', 'AI', false, 0);
        const colony = new Colony('c1', 'p1', 'Col1', 3, 3, 1);
        ai.colonies.push(colony);
        const unit = new Unit('u1', 'p1', UnitType.COLONIST, 2, 2, 1);
        ai.units.push(unit);

        const updatedPlayers = TurnEngine.runAITurn([ai], map);
        const updatedAI = updatedPlayers[0];

        expect(updatedAI.colonies.length).toBe(1); // Only the existing one
        expect(updatedAI.units.length).toBe(1);
        expect(updatedAI.units[0].x).toBe(2);
        expect(updatedAI.units[0].y).toBe(2);
      });
  });
});
