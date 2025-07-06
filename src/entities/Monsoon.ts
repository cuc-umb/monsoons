import { Creature } from "./Creature"
import type { GLTF } from "three/examples/jsm/Addons.js"
import { TerrainCell } from "./TerrainCell"

export class Monsoon extends Creature {
  constructor(model: GLTF, cell: TerrainCell, scale: number) {
    super(model, cell, scale)
  }

  // Очистка интервала при удалении объекта
  dispose() {
  }
}