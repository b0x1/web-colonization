import type { Player } from '@shared/game/entities/Player';
import type { Tile } from '@shared/game/entities/Tile';
import type { GoodType, TurnPhase } from '@shared/game/entities/types';
import type { NamingStats } from '@shared/game/systems/NamingSystem';

export interface AuthoritativeGameState {
  players: Player[];
  currentPlayerId: string;
  turn: number;
  phase: TurnPhase;
  europePrices: Record<GoodType, number>;
  map: Tile[][];
  namingStats: NamingStats;
}
