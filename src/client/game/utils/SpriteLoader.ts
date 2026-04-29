import type Phaser from 'phaser';

export interface SpriteFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type SpriteManifest = Record<string, SpriteFrame>;

/**
 * SpriteLoader manages the loading and registration of AVIF spritesheets
 * and their associated JSON manifests into the Phaser texture manager.
 */
/* eslint-disable-next-line @typescript-eslint/no-extraneous-class */
export class SpriteLoader {
  private constructor() {
    // Static utility class
  }

  /**
   * Preloads a spritesheet and its manifest.
   * To be called inside a Phaser Scene's preload() method.
   */
  static preload(scene: Phaser.Scene, key: string, avifUrl: string, jsonUrl: string): void {
    scene.load.image(key, avifUrl);
    scene.load.json(`${key}-manifest`, jsonUrl);
  }

  /**
   * Registers frames from the loaded manifest into the texture manager.
   * To be called inside a Phaser Scene's create() method.
   */
  static register(scene: Phaser.Scene, key: string): void {
    const manifest = scene.cache.json.get(`${key}-manifest`) as SpriteManifest | undefined;
    const texture = scene.textures.get(key);

    if (!manifest || texture.key === '__MISSING') {
      return;
    }

    Object.entries(manifest).forEach(([frameName, frame]) => {
      // Avoid duplicate frames if the texture is shared across scenes
      if (!texture.has(frameName)) {
        texture.add(frameName, 0, frame.x, frame.y, frame.w, frame.h);
      }
    });
  }

  /**
   * Exposes getSprite(name) as requested, which returns the frame data from the manifest.
   * Assumes the manifest is already loaded into the cache.
   */
  static getSprite(scene: Phaser.Scene, key: string, frameName: string): SpriteFrame | null {
    const manifest = scene.cache.json.get(`${key}-manifest`) as SpriteManifest | undefined;
    return manifest?.[frameName] ?? null;
  }
}
