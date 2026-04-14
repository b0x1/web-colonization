import type { Player } from '../entities/Player';
import type { Tile } from '../entities/Tile';
import type { NamingStats } from './NamingSystem';

export interface AIUnitMovedEffect {
  readonly type: 'unitMoved';
  readonly id: string;
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
}

export interface AISystemResult {
  readonly players: Player[];
  readonly namingStats: NamingStats;
  readonly effects: readonly AIUnitMovedEffect[];
}

/* eslint-disable-next-line @typescript-eslint/no-extraneous-class */
export class AISystem {
  private constructor() {
    // Static utility class
  }

  static runAITurn(
    players: Player[],
    _map: Tile[][],
    namingStats: NamingStats,
    _random: () => number,
    _generateId: (prefix: string) => string
  ): AISystemResult {
    // AI is currently disabled/unused, returning players unchanged
    return {
      players: [...players],
      namingStats: { ...namingStats },
      effects: [],
    };
  }
}
