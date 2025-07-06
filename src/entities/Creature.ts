import { Object3D, AnimationMixer, Box3 } from "three"
import { Vector3, AnimationAction } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"
import { TerrainCell } from "./TerrainCell"

export class Creature extends Object3D {
  private mixer: AnimationMixer
  private animationActions: Record<string, AnimationAction>
  modelSize: Vector3
  currentCell?: TerrainCell

  constructor(model: GLTF, cell: TerrainCell, scale: number) {
    super()

    const creatureModelScene = model.scene.clone()
    creatureModelScene.scale.set(scale, scale, scale)

    this.add(creatureModelScene)

    this.mixer = new AnimationMixer(creatureModelScene)
    this.animationActions = {}
    model.animations.forEach((clip) => {
      this.animationActions[clip.name] = this.mixer.clipAction(clip)
    })

    const bbox = new Box3().setFromObject(this)
    this.modelSize = bbox.getSize(new Vector3())
    
    this.moveTo(cell)
  }

  playAnimation(animationName: string): void {
    const action = this.animationActions[animationName]
    if (action) {
      action.reset().play()
    } else {
      console.warn(`Animation "${animationName}" not found.`)
    }
  }

  update(deltaTime: number): void {
    this.mixer.update(deltaTime)
  }

  moveTo(cell: TerrainCell): boolean {
    const cellWithTrees = cell.decorations.some(decoration => decoration.type === 'tree')
    const isAdjacent = this.currentCell ? this.currentCell.isAdjacent(cell) : true
    const canMove = cell !== this.currentCell && 
                   cell.isLand && 
                   !cellWithTrees && 
                   !cell.isBusyByCreature && 
                   isAdjacent

    if (!canMove) {
      return false
    }

    if (this.currentCell) {
      const rotationAngle = this.currentCell.getDirectionTo(cell)
      this.rotation.y = rotationAngle

      this.currentCell.setBusy(false)
    }

    this.position.set(
      cell.position.x,
      cell.height + this.modelSize.y / 2,
      cell.position.y
    )
    this.currentCell = cell
    this.currentCell.setBusy(true)

    return true
  }
}