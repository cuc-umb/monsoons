import type { TTerrainLevel } from "./types"

export const CELL_RADIUS = 1
export const CELL_MAX_HEIGHT = 10
export const DEFAULT_TERRAIN_SIZE = 10

export const TERRAIN_LEVELS: Record<Exclude<TTerrainLevel, 'water'>, number> = {
  stone: CELL_MAX_HEIGHT * 0.8,
  dirt: CELL_MAX_HEIGHT * 0.7,
  grass: CELL_MAX_HEIGHT * 0.5,
  sand: CELL_MAX_HEIGHT * 0.3,
  wetDirt: CELL_MAX_HEIGHT * 0
}

export const TERRAIN_LEVELS_TEXTURES: Record<TTerrainLevel, string> = {
  dirt: 'src/assets/textures/dirt.png',
  grass: 'src/assets/textures/grass.jpg',
  sand: 'src/assets/textures/sand.jpg',
  stone: 'src/assets/textures/stone.png',
  water: 'src/assets/textures/water.jpg',
  wetDirt: 'src/assets/textures/wet-dirt.jpg'
}

export const TERRAIN_GENERATION = {
  NOISE_SCALE: 0.1,    // Масштаб шума (плавность переходов)
  NOISE_POWER: 1     // Экспонента (контрастность рельефа)
} as const

export const MAX_CLOUDS_COUNT = 5