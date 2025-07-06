import { Intersection, InstancedMesh, Raycaster } from "three"
import { Creature } from "./Creature"
import type { GLTF } from "three/examples/jsm/Addons.js"
import { Terrain } from "./Terrain"
import { TerrainCell } from "./TerrainCell"

type TListenerMap = {
  mousedown: (event: MouseEvent) => void;
  mousemove: (event: MouseEvent) => void;
  mouseup: (event: MouseEvent) => void;
};
type TActionsMap = {
  click: Array<() => void>; // Упрощаем до функций без параметров, так как они уже будут забиндены
};

export class Player extends Creature {
  private interactionState: 'idle' | 'clicked' | 'dragging' = 'idle'
  private readonly DRAG_THRESHOLD = 5 // пикселей
  private mouseStartPosition = { x: 0, y: 0 }
  private listenersMap: TListenerMap = {} as TListenerMap
  private actionsMap: TActionsMap = {} as TActionsMap

  constructor(model: GLTF, cell: TerrainCell, scale: number) {
    super(model, cell, scale)
    this.initializeControls()
  }

  private initializeControls() {
    this.listenersMap.mousedown = this.onMouseDown.bind(this)
    this.listenersMap.mousemove = this.onMouseMove.bind(this)
    this.listenersMap.mouseup = this.onMouseUp.bind(this)

    document.addEventListener('mousedown', this.listenersMap.mousedown)
    document.addEventListener('mousemove', this.listenersMap.mousemove)
    document.addEventListener('mouseup', this.listenersMap.mouseup)
  }

  private onMouseDown(event: MouseEvent) {
    this.interactionState = 'clicked'
    this.mouseStartPosition = {
      x: event.clientX,
      y: event.clientY
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (this.interactionState !== 'clicked') return

    const deltaX = Math.abs(event.clientX - this.mouseStartPosition.x)
    const deltaY = Math.abs(event.clientY - this.mouseStartPosition.y)

    if (deltaX > this.DRAG_THRESHOLD || deltaY > this.DRAG_THRESHOLD) {
      this.interactionState = 'dragging'
    }
  }

  private onMouseUp() {
    if (this.interactionState === 'dragging') {
      this.interactionState = 'idle'
      return
    }

    if (this.interactionState === 'clicked') {
      if (this.actionsMap.click) {
        this.actionsMap.click.forEach((clickAction) => { clickAction() })
      }
    }

    this.interactionState = 'idle'
  }

  addAction<TFunc extends (...args: any[]) => void>(
    action: TFunc,
    ...args: Parameters<TFunc>
  ): void {
    const boundAction = action.bind(this, ...args)
    if (this.actionsMap.click) {
      this.actionsMap.click.push(boundAction)
    } else {
      this.actionsMap.click = [boundAction]
    }
  }

  clickOnTerrain(raycaster: Raycaster, terrain: Terrain) {
    const intersects = raycaster.intersectObject(terrain)
    const intersection = intersects[0]

    if (!intersection) return

    const targetCell = terrain.getTerrainCellByIntersection(intersection as Intersection<InstancedMesh>)

    if (!targetCell) return

    this.moveTo(targetCell)
  }

  dispose() {
    let key: keyof typeof this.listenersMap
    for (key in this.listenersMap) {
      document.removeEventListener(key, this.listenersMap[key])
    }
  }
}
