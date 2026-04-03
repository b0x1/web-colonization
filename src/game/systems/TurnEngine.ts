import { Player } from '../entities/Player';
import { Tile } from '../entities/Tile';
import { Colony } from '../entities/Colony';
import { Unit } from '../entities/Unit';
import { TerrainType, GoodType, ResourceType, UnitType } from '../entities/types';
import { eventBus } from '../state/EventBus';

export class TurnEngine {
  static runProduction(players: Player[], map: Tile[][]): Player[] {
    const updatedPlayers = players.map((player) => {
      const newPlayer = new Player(player.id, player.name, player.isHuman, player.gold);
      // Deep clone units
      newPlayer.units = player.units.map((u) => {
        const nu = new Unit(u.id, u.ownerId, u.type, u.x, u.y, u.movesRemaining);
        nu.cargo = new Map(u.cargo);
        nu.maxMoves = u.maxMoves;
        return nu;
      });
      // Deep clone colonies and process production
      newPlayer.colonies = player.colonies.map((colony) => {
        const newColony = new Colony(
          colony.id,
          colony.ownerId,
          colony.name,
          colony.x,
          colony.y,
          colony.population,
        );
        newColony.buildings = [...colony.buildings];
        newColony.productionQueue = [...colony.productionQueue];
        newColony.inventory = new Map(colony.inventory);

        // Food from population (2 per pop)
        const currentFood = newColony.inventory.get(GoodType.FOOD) || 0;
        newColony.inventory.set(GoodType.FOOD, currentFood + colony.population * 2);

        // Goods from surrounding tiles (9 tiles: colony tile + 8 neighbors)
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const tx = colony.x + dx;
            const ty = colony.y + dy;
            if (ty >= 0 && ty < map.length && tx >= 0 && tx < map[ty].length) {
              const tile = map[ty][tx];
              this.addTileProduction(newColony, tile);
            }
          }
        }

        return newColony;
      });
      return newPlayer;
    });

    eventBus.emit('productionCompleted', updatedPlayers);
    return updatedPlayers;
  }

  private static addTileProduction(colony: Colony, tile: Tile) {
    let type: GoodType | null = null;
    let amount = 0;

    if (tile.hasResource === ResourceType.FOREST) {
      type = GoodType.LUMBER;
      amount = 3;
    } else {
      switch (tile.terrainType) {
        case TerrainType.PLAINS:
          type = GoodType.FOOD;
          amount = 2;
          break;
        case TerrainType.GRASSLAND:
          type = GoodType.FOOD;
          amount = 3;
          break;
        case TerrainType.OCEAN:
          type = GoodType.FOOD;
          amount = 2;
          break;
        case TerrainType.DESERT:
          type = GoodType.ORE;
          amount = 1;
          break;
        case TerrainType.SWAMP:
          type = GoodType.LUMBER;
          amount = 1;
          break;
        case TerrainType.TUNDRA:
          type = GoodType.FURS;
          amount = 1;
          break;
        case TerrainType.MARSH:
          type = GoodType.FOOD;
          amount = 1;
          break;
      }
    }

    if (type && amount > 0) {
      const current = colony.inventory.get(type) || 0;
      colony.inventory.set(type, current + amount);
    }
  }

  static runAITurn(players: Player[], map: Tile[][]): Player[] {
    eventBus.emit('aiTurnStarted');

    // Deep clone players to work on
    const updatedPlayers = players.map((p) => {
      const np = new Player(p.id, p.name, p.isHuman, p.gold);
      np.units = p.units.map((u) => {
        const nu = new Unit(u.id, u.ownerId, u.type, u.x, u.y, u.movesRemaining);
        nu.cargo = new Map(u.cargo);
        nu.maxMoves = u.maxMoves;
        return nu;
      });
      np.colonies = p.colonies.map((c) => {
        const nc = new Colony(c.id, c.ownerId, c.name, c.x, c.y, c.population);
        nc.buildings = [...c.buildings];
        nc.productionQueue = [...c.productionQueue];
        nc.inventory = new Map(c.inventory);
        return nc;
      });
      return np;
    });

    for (let i = 0; i < updatedPlayers.length; i++) {
      const player = updatedPlayers[i];
      if (player.isHuman) continue;

      let unitIndex = 0;
      while (unitIndex < player.units.length) {
        const unit = player.units[unitIndex];
        if (unit.movesRemaining <= 0) {
          unitIndex++;
          continue;
        }

        let unitRemoved = false;

        // Check if colonist can found a colony
        if (unit.type === UnitType.COLONIST) {
          const currentTile = map[unit.y][unit.x];
          if (currentTile.terrainType === TerrainType.PLAINS) {
            const hasAdjacentFriendlyColony = player.colonies.some(
              (c) => Math.abs(c.x - unit.x) <= 1 && Math.abs(c.y - unit.y) <= 1,
            );
            if (!hasAdjacentFriendlyColony) {
              // Found colony
              const newColony = new Colony(
                `colony-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                player.id,
                `${player.name}'s Colony`,
                unit.x,
                unit.y,
                1,
              );
              player.colonies.push(newColony);
              // Remove unit from player
              player.units.splice(unitIndex, 1);
              eventBus.emit('colonyFounded', newColony);
              unitRemoved = true;
            }
          }
        }

        if (!unitRemoved) {
          // Move toward nearest uncolonized PLAINS or FOREST
          const allColonies = updatedPlayers.flatMap((p) => p.colonies);
          const target = this.findNearestTarget(unit, map, allColonies);
          if (target) {
            const dx = Math.sign(target.x - unit.x);
            const dy = Math.sign(target.y - unit.y);

            const nx = unit.x + dx;
            const ny = unit.y + dy;

            if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[ny].length) {
              const targetTile = map[ny][nx];
              if (unit.movesRemaining >= targetTile.movementCost) {
                unit.x = nx;
                unit.y = ny;
                unit.movesRemaining -= targetTile.movementCost;
                eventBus.emit('unitMoved', unit);
              }
            }
          }
          unitIndex++;
        }
      }
    }

    eventBus.emit('aiTurnCompleted', updatedPlayers);
    return updatedPlayers;
  }

  private static findNearestTarget(
    unit: Unit,
    map: Tile[][],
    allColonies: Colony[],
  ): { x: number; y: number } | null {
    let nearest: { x: number; y: number } | null = null;
    let minDistance = Infinity;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        const isTargetType =
          tile.terrainType === TerrainType.PLAINS || tile.hasResource === ResourceType.FOREST;
        if (!isTargetType) continue;

        const isColonized = allColonies.some((c) => c.x === x && c.y === y);
        if (isColonized) continue;

        // Chebyshev distance for grid movement including diagonals
        const dist = Math.max(Math.abs(x - unit.x), Math.abs(y - unit.y));
        if (dist > 0 && dist < minDistance) {
          minDistance = dist;
          nearest = { x, y };
        }
      }
    }
    return nearest;
  }
}
