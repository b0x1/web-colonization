import React from 'react';
import { GoodType } from '../game/entities/types';
import { Sprite } from './SettlementScreen/Sprite';

// Import SVG paths
import FoodIcon from '../assets/sprites/resources/FOOD.svg';
import LumberIcon from '../assets/sprites/resources/LUMBER.svg';
import OreIcon from '../assets/sprites/resources/ORE.svg';
import SugarIcon from '../assets/sprites/resources/SUGAR.svg';
import RumIcon from '../assets/sprites/resources/RUM.svg';
import ClothIcon from '../assets/sprites/resources/CLOTH.svg';
import CoatsIcon from '../assets/sprites/resources/COATS.svg';
import CigarsIcon from '../assets/sprites/resources/CIGARS.svg';
import ToolsIcon from '../assets/sprites/resources/TOOLS.svg';
import TradeGoodsIcon from '../assets/sprites/resources/TRADE_GOODS.svg';
import MusketsIcon from '../assets/sprites/resources/MUSKETS.svg';

interface ResourceIconProps {
  good: GoodType;
  size?: number;
  className?: string;
}

const SVG_ICONS: Partial<Record<GoodType, string>> = {
  [GoodType.FOOD]: FoodIcon,
  [GoodType.LUMBER]: LumberIcon,
  [GoodType.ORE]: OreIcon,
  [GoodType.SUGAR]: SugarIcon,
  [GoodType.RUM]: RumIcon,
  [GoodType.CLOTH]: ClothIcon,
  [GoodType.COATS]: CoatsIcon,
  [GoodType.CIGARS]: CigarsIcon,
  [GoodType.TOOLS]: ToolsIcon,
  [GoodType.TRADE_GOODS]: TradeGoodsIcon,
  [GoodType.MUSKETS]: MusketsIcon,
};

export const ResourceIcon: React.FC<ResourceIconProps> = ({ good, size = 32, className = '' }) => {
  const isSvg = !!SVG_ICONS[good];

  if (isSvg) {
    return (
      <img
        src={SVG_ICONS[good]}
        alt={good}
        className={className}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  // Fallback to spritesheet for those that have it
  const spriteType = good as string;
  return (
    <div className={`relative ${className}`} style={{ width: `${size}px`, height: `${size}px` }}>
      <Sprite type={spriteType} category="resources" size={size} />
    </div>
  );
};
