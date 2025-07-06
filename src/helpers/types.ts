import { Texture } from "three"
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
