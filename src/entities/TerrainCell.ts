import { CylinderGeometry, Vector3 } from "three"
import { Vector2 } from "three"
import type { TDecoration, TTerrainLevel } from "../helpers/types"
import { CELL_RADIUS } from "../helpers/constants"

export class TerrainCell extends CylinderGeometry {
  level: TTerrainLevel
  height: number
  position: Vector2
  isLand: boolean
  instanceId?: number
  decorations: TDecoration[] = []
  isBusyByCreature: boolean
  gridX: number
  gridY: number

  constructor(height: number, position: Vector2, level: TTerrainLevel) {
    super(CELL_RADIUS, CELL_RADIUS, height, 6, 1, false)

    this.height = height
    this.position = new Vector2(position.x, position.y)
    this.level = level
    this.isLand = (['dirt', 'grass', 'sand', 'stone'] as TTerrainLevel[]).includes(level)
    this.isBusyByCreature = false

    const hexWidth = CELL_RADIUS * Math.sqrt(3);
    const hexHeight = CELL_RADIUS * 2;
    
    // Используем согласованное преобразование координат
    this.gridY = Math.round(position.y / (hexHeight * 0.75));
    this.gridX = Math.round((position.x / hexWidth) - (Math.abs(this.gridY) % 2) * 0.5);

    this.translate(this.position.x, height * 0.5, this.position.y)
    this.generateDecorations()
  }

  generateDecorations() {
    this.decorations = []
    switch (this.level) {
      case "sand":
      case "stone": {
        if (Math.random() > 0.8) {
          this.decorations.push({ type: 'stone', position: new Vector3(this.position.x, this.height, this.position.y) })
        }
        break;
      }
      case "dirt":
      case "grass": {
        if (Math.random() > 0.8) {
          this.decorations.push({ type: 'tree', position: new Vector3(this.position.x, this.height, this.position.y) })
        }
        break;
      }
      default:
        break;
    }
  }

  setBusy(value: boolean) {
    this.isBusyByCreature = value
  }

  isAdjacent(otherCell: TerrainCell): boolean {
    const directions = this.gridY % 2 === 0
      ? [ // Четная строка
        [-1, 0], [1, 0],   // Слева и справа
        [-1, -1], [0, -1], // Сверху
        [-1, 1], [0, 1]    // Снизу
      ]
      : [ // Нечетная строка
        [-1, 0], [1, 0],   // Слева и справа
        [0, -1], [1, -1],  // Сверху
        [0, 1], [1, 1]     // Снизу
      ];

    // Проверяем все возможные направления
    return directions.some(([dx, dy]) =>
      this.gridX + dx === otherCell.gridX &&
      this.gridY + dy === otherCell.gridY
    );
  }

  // Вспомогательный метод для получения направления к соседней ячейке
  getDirectionTo(targetCell: TerrainCell): number {
    if (!this.isAdjacent(targetCell)) {
        return 0;
    }

    // Используем мировые координаты для расчета угла
    const dx = targetCell.position.x - this.position.x;
    const dy = targetCell.position.y - this.position.y;

    // Возвращаем угол в радианах между текущей позицией и целевой
    // Math.atan2 возвращает угол в радианах между положительной осью X 
    // и точкой с координатами (x,y)
    return Math.atan2(dy, dx);
  }
}
