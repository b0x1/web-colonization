import type { TerrainType } from '../entities/types';
import type { Position } from '../entities/Position';

export class TileMap {
  public readonly width: number;
  public readonly height: number;
  public readonly data: TerrainType[][];

  constructor(width: number, height: number, data: TerrainType[][]) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  public getTerrainAt(pos: Position): TerrainType | null {
    const row = this.data[pos.y];
    if (!row) return null;
    return row[pos.x] ?? null;
  }
}
