import type { SaveGameState } from '@shared/game/protocol';
import { SaveSystem } from '@shared/game/systems/SaveSystem';

export interface SaveMeta {
  slotName: string;
  timestamp: number;
  playerName: string;
  turn: number;
}

export class SaveManager { // eslint-disable-line @typescript-eslint/no-extraneous-class
  private static readonly MANIFEST_KEY = 'webcol_saves';
  private static readonly SAVE_PREFIX = 'webcol_save_';

  static save(state: SaveGameState, slotName: string): void {
    const serialized = SaveSystem.serialize(state);
    localStorage.setItem(this.getSaveKey(slotName), serialized);
    this.updateManifest(slotName, state);
  }

  static load(slotName: string): SaveGameState | null {
    const serialized = localStorage.getItem(this.getSaveKey(slotName));
    if (!serialized) {
      return null;
    }

    return SaveSystem.deserialize(serialized);
  }

  static listSaves(): SaveMeta[] {
    const manifestJson = localStorage.getItem(this.MANIFEST_KEY);
    if (!manifestJson) {
      return [];
    }

    const parsed = JSON.parse(manifestJson) as unknown;
    return this.isSaveMetaList(parsed) ? parsed : [];
  }

  static downloadSave(slotName: string): void {
    const serialized = localStorage.getItem(this.getSaveKey(slotName));
    if (!serialized) {
      return;
    }

    const blob = new Blob([serialized], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `webcol_save_${slotName}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static deleteSave(slotName: string): void {
    localStorage.removeItem(this.getSaveKey(slotName));
    const updatedManifest = this.listSaves().filter((save) => save.slotName !== slotName);
    localStorage.setItem(this.MANIFEST_KEY, JSON.stringify(updatedManifest));
  }

  private static updateManifest(slotName: string, state: SaveGameState): void {
    const manifest = this.listSaves();
    const humanPlayer = state.players.find((player) => player.isHuman);
    const saveMeta: SaveMeta = {
      slotName,
      timestamp: Date.now(),
      playerName: humanPlayer?.name ?? 'Unknown',
      turn: state.turn,
    };

    const existingIndex = manifest.findIndex((save) => save.slotName === slotName);
    if (existingIndex >= 0) {
      manifest[existingIndex] = saveMeta;
    } else {
      manifest.push(saveMeta);
    }

    localStorage.setItem(this.MANIFEST_KEY, JSON.stringify(manifest));
  }

  private static getSaveKey(slotName: string): string {
    return `${this.SAVE_PREFIX}${slotName}`;
  }

  private static isSaveMetaList(value: unknown): value is SaveMeta[] {
    if (!Array.isArray(value)) {
      return false;
    }

    return value.every((item) => {
      if (typeof item !== 'object' || item === null) {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      return typeof candidate.slotName === 'string' &&
        typeof candidate.timestamp === 'number' &&
        typeof candidate.playerName === 'string' &&
        typeof candidate.turn === 'number';
    });
  }
}
