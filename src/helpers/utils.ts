import { WebGLRenderer } from "three"
import { TERRAIN_LEVELS } from "./constants"
import type { TTerrainLevel } from "./types"

export function getTerrainLevelByHeight(height: number): TTerrainLevel {
  const levels = Object.keys(TERRAIN_LEVELS) as (keyof typeof TERRAIN_LEVELS)[]
  for (const level of levels) {    
    if (height > TERRAIN_LEVELS[level]) {
      return level
    }
  }
  
  return 'wetDirt'
}

export function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement
  const needResize = canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight

  if (needResize) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  }

  return needResize
}

export function getRandomElements<T>(arr: T[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}