import React from 'react';
import terrainManifest from '../../assets/data/terrain.json';
import resourceManifest from '../../assets/data/resources.json';
import otherManifest from '../../assets/data/other.json';

interface SpriteProps {
  type: string;
  category: 'terrain' | 'resources' | 'other';
  size?: number;
  className?: string;
}

export const Sprite: React.FC<SpriteProps> = ({ type, category, size = 64, className = '' }) => {
  const manifest = category === 'terrain' ? terrainManifest : (category === 'resources' ? resourceManifest : otherManifest);
  const coords = (manifest as any)[type];

  if (!coords) return null;

  // Calculate total spritesheet size based on manifest (all are 64x64 blocks)
  // For terrain: 4 cols (0, 64, 128, 192) x 4 rows (0, 64, 128, 192) based on public/terrain.json
  // For resources: 3 cols x 3 rows based on public/resources.json
  // For other: 3 cols x 2 rows
  const totalWidth = category === 'terrain' ? 256 : 192;
  const totalHeight = category === 'terrain' ? 256 : (category === 'resources' ? 192 : 128);

  const scale = size / 64;

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
};
