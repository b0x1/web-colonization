export const GoodType = {
  FOOD: 'FOOD',
  LUMBER: 'LUMBER',
  ORE: 'ORE',
  LEAF_CROP: 'LEAF_CROP',
  FIBER_CROP: 'FIBER_CROP',
  PELTS: 'PELTS',
  TOOLS: 'TOOLS',
  FIREARMS: 'FIREARMS',
} as const;
export type GoodType = (typeof GoodType)[keyof typeof GoodType];

export const ResourceType = {
  FOREST: 'FOREST',
  ORE_DEPOSIT: 'ORE_DEPOSIT',
  FISH: 'FISH',
  FERTILE_LAND: 'FERTILE_LAND',
} as const;
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const UnitType = {
  SETTLER: 'SETTLER',
  MILITIA: 'MILITIA',
  FRONTIERSMAN: 'FRONTIERSMAN',
  SHIP: 'SHIP',
} as const;
export type UnitType = (typeof UnitType)[keyof typeof UnitType];

export const TerrainType = {
  OCEAN: 'OCEAN',
  COAST: 'COAST',
  PLAINS: 'PLAINS',
  FOREST: 'FOREST',
  HILLS: 'HILLS',
  MOUNTAINS: 'MOUNTAINS',
  GRASSLAND: 'GRASSLAND',
  PRAIRIE: 'PRAIRIE',
  TUNDRA: 'TUNDRA',
  ARCTIC: 'ARCTIC',
  DESERT: 'DESERT',
  SWAMP: 'SWAMP',
  MARSH: 'MARSH',
} as const;
export type TerrainType = (typeof TerrainType)[keyof typeof TerrainType];

export const BuildingType = {
  TOWN_HALL: 'TOWN_HALL',
  WOOD_WORKSHOP: 'WOOD_WORKSHOP',
  SAWMILL: 'SAWMILL',
  BLACKSMITHS_HOUSE: 'BLACKSMITHS_HOUSE',
  BLACKSMITHS_SHOP: 'BLACKSMITHS_SHOP',
  IRON_WORKS: 'IRON_WORKS',
  CORRAL: 'CORRAL',
  WAREHOUSE: 'WAREHOUSE',
  SCHOOLHOUSE: 'SCHOOLHOUSE',
  FORTIFICATION: 'FORTIFICATION',
  PUBLISHING_HOUSE: 'PUBLISHING_HOUSE',
} as const;
export type BuildingType = (typeof BuildingType)[keyof typeof BuildingType];

export const JobType = {
  FARMER: 'FARMER',
  LUMBERJACK: 'LUMBERJACK',
  MINER: 'MINER',
  TOBACCONIST: 'TOBACCONIST',
  WEAVER: 'WEAVER',
} as const;
export type JobType = (typeof JobType)[keyof typeof JobType];

export const TurnPhase = {
  MOVEMENT: 'MOVEMENT',
  PRODUCTION: 'PRODUCTION',
  TRADE: 'TRADE',
  AI: 'AI',
  END_TURN: 'END_TURN',
} as const;
export type TurnPhase = (typeof TurnPhase)[keyof typeof TurnPhase];

export const Tribe = {
  NAHUATL: 'NAHUATL',
  HAUDENOSAUNEE: 'HAUDENOSAUNEE',
  TSALAGI: 'TSALAGI',
  LAKOTA: 'LAKOTA',
} as const;
export type Tribe = (typeof Tribe)[keyof typeof Tribe];

export const Attitude = {
  FRIENDLY: 'FRIENDLY',
  NEUTRAL: 'NEUTRAL',
  HOSTILE: 'HOSTILE',
} as const;
export type Attitude = (typeof Attitude)[keyof typeof Attitude];
