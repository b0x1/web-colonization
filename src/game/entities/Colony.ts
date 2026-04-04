import type { BuildingType, GoodType, UnitType, JobType } from './types';
import type { Unit } from './Unit';

export class Colony {
  public buildings: BuildingType[] = [];
  public inventory = new Map<GoodType, number>();
  public productionQueue: (UnitType | BuildingType)[] = [];
  public workforce = new Map<string, JobType>();
  public units: Unit[] = [];

  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public name: string,
    public readonly x: number,
    public readonly y: number,
    public population: number,
  ) {}
}
