import type { GameState } from '../state/gameStore';

export interface SaveData {
  players: GameState['players'];
  currentPlayerId: string;
  turn: number;
  phase: GameState['phase'];
  europePrices: GameState['europePrices'];
  map: GameState['map'];
}

/* eslint-disable-next-line @typescript-eslint/no-extraneous-class */
export class SaveSystem {
  private constructor() {
    // Static utility class
  }

  static serialize(
   state: Pick<GameState, 'players' | 'currentPlayerId' | 'turn' | 'phase' | 'europePrices' | 'map'>
  ): string {
    const data: SaveData = {
      players: state.players,
      currentPlayerId: state.currentPlayerId,
      turn: state.turn,
      phase: state.phase,
      europePrices: state.europePrices,
      map: state.map,
    };

    return JSON.stringify(data, (key, value) => this.replacer(key, value));
  }

  static deserialize(serialized: string): Partial<GameState> | null {
    try {
      return JSON.parse(serialized, (key, value) => this.reviver(key, value)) as SaveData;
    } catch {
      return null;
    }
  }

  private static replacer(_key: string, value: unknown): unknown {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()),
      };
    }

    return value;
  }

  private static reviver(_key: string, value: unknown): unknown {
    if (this.isSerializedMap(value)) {
      return new Map(value.value);
    }

    return value;
  }

  private static isSerializedMap(
    value: unknown
  ): value is { dataType: 'Map'; value: [unknown, unknown][] } {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const candidate = value as { dataType?: unknown; value?: unknown };
    return candidate.dataType === 'Map' && Array.isArray(candidate.value);
  }
}
