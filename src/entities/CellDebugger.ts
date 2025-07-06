import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import { TerrainCell } from './TerrainCell';
import { InstancedMesh } from 'three';

export class CellDebugger {
  private labels: CSS2DObject[] = [];

  addLabel(cell: TerrainCell, parentGroup: InstancedMesh) {
    const labelDiv = document.createElement('div')
    labelDiv.className = 'cell-label'
    labelDiv.textContent = `${cell.gridX}:${cell.gridY}`
    labelDiv.style.color = 'white'
    labelDiv.style.fontFamily = 'Arial'
    labelDiv.style.fontSize = '12px'
    labelDiv.style.textShadow = '0 0 2px black'

    const label = new CSS2DObject(labelDiv);
    label.position.set(cell.position.x, cell.height, cell.position.y)
    parentGroup.add(label)
    this.labels.push(label)
  }

  clear() {
    this.labels.forEach(label => label.parent?.remove(label))
    this.labels = []
  }
}