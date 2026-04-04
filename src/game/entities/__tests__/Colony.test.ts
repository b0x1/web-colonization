import { describe, it, expect } from 'vitest';
import { Colony } from '../Colony';
import { BuildingType, GoodType, UnitType } from '../types';

describe('Colony', () => {
  it('should initialize with correct values', () => {
    const colony = new Colony('colony-1', 'player-1', 'Jamestown', 15, 20, 3);
    expect(colony.id).toBe('colony-1');
    expect(colony.ownerId).toBe('player-1');
    expect(colony.name).toBe('Jamestown');
    expect(colony.x).toBe(15);
    expect(colony.y).toBe(20);
    expect(colony.population).toBe(3);
  });

  it('should have empty buildings, inventory, and production queue by default', () => {
    const colony = new Colony('col-1', 'p-1', 'A', 0, 0, 1);
    expect(colony.buildings).toEqual([]);
    expect(colony.inventory.size).toBe(0);
    expect(colony.productionQueue).toEqual([]);
  });

  it('should be able to add buildings', () => {
    const colony = new Colony('col-1', 'p-1', 'A', 0, 0, 1);
    colony.buildings.push(BuildingType.TOWN_HALL);
    expect(colony.buildings).toContain(BuildingType.TOWN_HALL);
  });

  it('should be able to add goods to inventory', () => {
    const colony = new Colony('col-1', 'p-1', 'A', 0, 0, 1);
    colony.inventory.set(GoodType.LUMBER, 50);
    expect(colony.inventory.get(GoodType.LUMBER)).toBe(50);
  });

  it('should be able to add items to the production queue', () => {
    const colony = new Colony('col-1', 'p-1', 'A', 0, 0, 1);
    colony.productionQueue.push(UnitType.SOLDIER);
    colony.productionQueue.push(BuildingType.WAREHOUSE);
    expect(colony.productionQueue).toEqual([
      UnitType.SOLDIER,
      BuildingType.WAREHOUSE,
    ]);
  });
});
