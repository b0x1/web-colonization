import type { GoodType, UnitType } from './types';

export class Unit {
  public cargo = new Map<GoodType, number>();
  public maxMoves: number;

  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly type: UnitType,
    public x: number,
    public y: number,
    public movesRemaining: number,
  ) {
    this.maxMoves = movesRemaining;
  }
}
