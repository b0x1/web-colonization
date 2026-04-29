/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/restrict-plus-operands */
import React, { useState, useEffect } from 'react';
import { MAP_CONSTANTS } from '@shared/game/constants';

interface SpriteProps {
  type: string;
  category: 'terrain' | 'resources' | 'other' | 'flags' | 'units';
  size?: number;
  className?: string;
}

const manifestCache: Record<string, any> = {};
const pendingManifests: Record<string, Promise<any> | undefined> = {};
const sheetSizeCache = new WeakMap<object, { w: number; h: number }>();

const calculateSheetSize = (m: any) => {
  const cached = sheetSizeCache.get(m);
  if (cached) return cached;

  let maxX = 0;
  let maxY = 0;
  Object.values(m).forEach((v: any) => {
    maxX = Math.max(maxX, v.x + v.w);
    maxY = Math.max(maxY, v.y + v.h);
  });
  const size = { w: maxX, h: maxY };
  sheetSizeCache.set(m, size);
  return size;
};

/**
 * ⚡ Bolt: Optimized Sprite component.
 * Uses WeakMap to cache sheet size calculations (O(1) after first run).
 * Prevents redundant fetch calls for the same manifest.
 * Wrapped in React.memo to skip re-renders if props haven't changed.
 */
export const Sprite: React.FC<SpriteProps> = React.memo(({ type, category, size = MAP_CONSTANTS.TILE_SIZE, className = '' }) => {
  const [manifest, setManifest] = useState(manifestCache[category]);

  useEffect(() => {
    if (manifestCache[category]) {
      setManifest(manifestCache[category]);
      return;
    }

    const promise = (pendingManifests[category] ??= fetch(`/webcol/${category}.json`)
      .then((res) => res.json())
      .then((data) => {
        manifestCache[category] = data;
        pendingManifests[category] = undefined;
        return data as unknown;
      }));

    void promise.then((data) => {
      setManifest(data);
    });
  }, [category]);

  const coords = manifest?.[type];

  if (!coords) {
    if (manifest) {
      console.warn(`Sprite type "${type}" not found in category "${category}"`); // eslint-disable-line no-console
    }
    return null;
  }

  const sheetSize = calculateSheetSize(manifest);
  const totalWidth = sheetSize.w;
  const totalHeight = sheetSize.h;

  const scale = size / MAP_CONSTANTS.TILE_SIZE;

  return (
    <div
      className={`absolute inset-0 overflow-hidden shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(/webcol/${category}.avif)`,
        backgroundPosition: `-${coords.x * scale}px -${coords.y * scale}px`,
        backgroundSize: `${totalWidth * scale}px ${totalHeight * scale}px`,
        imageRendering: 'pixelated',
      }}
      title={type}
    />
  );
});

Sprite.displayName = 'Sprite';
