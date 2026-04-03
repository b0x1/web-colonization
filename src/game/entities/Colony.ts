import type { BuildingType, GoodType, UnitType } from './types';

export class Colony {
  public buildings: BuildingType[] = [];
  public inventory: Map<GoodType, number> = new Map();
  public productionQueue: (UnitType | BuildingType)[] = [];

  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public name: string,
    public readonly x: number,
    public readonly y: number,
    public population: number,
  ) {}
}
