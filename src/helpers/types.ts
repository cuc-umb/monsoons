import { Texture, Vector3 } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"

export type TTerrainLevel =
  'stone'
  | 'dirt'
  | 'grass'
  | 'sand'
  | 'wetDirt'
  | 'water'

export type TTerrainLevelTexture = Record<TTerrainLevel, Texture>

export type TCreatureGLTF = Record<string, GLTF>

export type TAssets = {
  textures: {
    terrain: TTerrainLevelTexture,
    envmap: Texture
  },
  models: TCreatureGLTF
}

export type TDecorationType = 'tree' | 'stone'

export type TDecoration = { type: TDecorationType; position: Vector3; scale?: Vector3 }