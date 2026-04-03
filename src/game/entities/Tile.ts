import type { ResourceType, TerrainType } from './types';

export class Tile {
  constructor(
    public readonly id: string,
    public readonly x: number,
    public readonly y: number,
    public terrainType: TerrainType,
    public movementCost: number,
    public hasResource: ResourceType | null = null,
  ) {}
}
