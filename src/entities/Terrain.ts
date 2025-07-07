import { CylinderGeometry, Euler, Group, InstancedMesh, Intersection, MeshPhysicalMaterial, Vector2, Vector3 } from "three"
import { TerrainCell } from "./TerrainCell"
import { CELL_MAX_HEIGHT, CELL_RADIUS, MAX_CLOUDS_COUNT, TERRAIN_LEVELS, TERRAIN_GENERATION } from "../helpers/constants"
import { SimplexNoise } from "three/examples/jsm/Addons.js"
import { TAssets, TDecoration, TDecorationType, TTerrainLevel } from "../helpers/types"
import { Water } from "./Water"
import { Border } from "./Border"
import { Cloud } from "./Cloud"
import { getTerrainLevelByHeight } from "../helpers/utils"
import { Tree } from "./Tree"
import { CellDebugger } from "../managers/DebugManager"
import { InstancedMeshManager } from "../managers/InstancedMeshManager"
import { Stone } from "./Stone"

export class Terrain extends Group {
  private debugger = new CellDebugger();

  private terrainCells: TerrainCell[] = []
  private assets: TAssets
  private cloudsGroup: Group = new Group()
  private instancedMeshes: Record<TTerrainLevel, InstancedMesh> = {} as Record<TTerrainLevel, InstancedMesh>;
  private decorationMeshes: Record<TDecorationType, InstancedMesh> = {} as Record<TDecorationType, InstancedMesh>;

  constructor(size: number, assets: TAssets) {
    super()

    this.assets = assets
    const { terrain, envmap } = assets.textures
    const { water: waterTexture, dirt: dirtTexture } = terrain

    this.initerrainMeshes(size)
    this.initDecorationMeshes()

    this.generateTerrainCells(size)
    this.generateClouds()

    const seaMesh = new Water(waterTexture, envmap, TERRAIN_LEVELS.sand, 17)
    this.add(seaMesh)
    const mapContainerMesh = new Border(dirtTexture, envmap, CELL_MAX_HEIGHT + 0.1, 17.1)
    this.add(mapContainerMesh)
  }

  private initerrainMeshes(size: number) {
    Object.keys(TERRAIN_LEVELS).forEach((levelKey) => {
      const level = levelKey as TTerrainLevel;
      const geometry = new CylinderGeometry(CELL_RADIUS, CELL_RADIUS, 1, 6);
      const material = new MeshPhysicalMaterial({
        map: this.assets.textures.terrain[level],
        envMap: this.assets.textures.envmap,
        envMapIntensity: 0.135,
        flatShading: true,
      });

      this.instancedMeshes[level] = new InstancedMesh(geometry, material, size * size * 4);
      this.instancedMeshes[level].count = 0;
      this.instancedMeshes[level].castShadow = true;
      this.instancedMeshes[level].receiveShadow = true;
      this.add(this.instancedMeshes[level])
    });
  }

  private initDecorationMeshes() {
    const stoneGeometry = new Stone(new Vector3(0, 0, 0));
    const treeGeometry = new Tree(new Vector3(0, 0, 0));

    const stoneMaterial = new MeshPhysicalMaterial({
      color: 0x777777, // Серый цвет камня
      roughness: 0.7, // Шероховатость для матового вида
      metalness: 0.1, // Лёгкий металлический отблеск
      flatShading: true, // Чёткие грани
      envMap: this.assets.textures.envmap,
      envMapIntensity: 0.135, // Слабое отражение окружения
    })

    const treeMaterial = new MeshPhysicalMaterial({
      color: 0x2d5a27, // Тёмно-зелёный для листвы
      roughness: 0.9, // Полностью матовый
      metalness: 0.0, // Без металлического блеска
      flatShading: false, // Плавные грани
      envMap: this.assets.textures.envmap,
      envMapIntensity: 0.135,
    })

    this.decorationMeshes.stone = new InstancedMesh(stoneGeometry, stoneMaterial, 1000);
    this.decorationMeshes.tree = new InstancedMesh(treeGeometry, treeMaterial, 500);

    this.decorationMeshes.stone.count = 0;
    this.decorationMeshes.tree.count = 0;
    
    this.add(this.decorationMeshes.stone)
    this.add(this.decorationMeshes.tree)
  }

  private generateTerrainCells(size: number) {
    const simplex = new SimplexNoise()

    for (let i = -size; i <= size; i++) {
      for (let j = -size; j <= size; j++) {
        const position = this.getPositionFromTile(i, j)

        if (position.length() > 16) { continue }
        
        // Генерация высоты ячейки с использованием шума
        const noise = Math.pow(
          (simplex.noise(
            i * TERRAIN_GENERATION.NOISE_SCALE, 
            j * TERRAIN_GENERATION.NOISE_SCALE
          ) + 1) * 0.5,
          TERRAIN_GENERATION.NOISE_POWER
        )
        const height = noise * CELL_MAX_HEIGHT
        const cellLevel = getTerrainLevelByHeight(height)

        if (!cellLevel) { continue }

        const cell = new TerrainCell(height, position, cellLevel)
        if (cell.decorations.length) {
          cell.decorations.forEach((decoration) => {
            this.addDecoration(decoration)
          })
        }

        this.addCell(cell)
      }
    }
  }
  
  private getPositionFromTile(tileX: number, tileY: number) {
    const hexWidth = CELL_RADIUS * Math.sqrt(3);
    const hexHeight = CELL_RADIUS * 2;
    
    // Смещение для нечетных рядов (важно использовать согласованный паттерн)
    const x = hexWidth * (tileX + (Math.abs(tileY) % 2) * 0.5);
    const y = hexHeight * 0.75 * tileY;

    return new Vector2(x, y);
  }

  private generateClouds() {
    const cloudsCount = Math.floor(Math.random() * MAX_CLOUDS_COUNT)
    for (let i = 0; i < cloudsCount; i++) {
      const cloud = new Cloud(this.assets.textures.envmap);
      this.cloudsGroup.add(cloud)
    }
    this.add(this.cloudsGroup)
  }

  addCell(cell: TerrainCell) {
    this.terrainCells.push(cell);
    const mesh = this.instancedMeshes[cell.level];
    if (!mesh) return;

    cell.instanceId = InstancedMeshManager.addInstance(
      mesh,
      new Vector3(cell.position.x, cell.height * 0.5, cell.position.y),
      new Vector3(1, cell.height, 1)
    );

    this.debugger.addLabel(cell, mesh);
  }

  addDecoration(decoration: TDecoration) {
    const mesh = this.decorationMeshes[decoration.type];
    if (!mesh) {}

    const instanceId = InstancedMeshManager.addInstance(
      mesh,
      decoration.position,
      decoration.scale || new Vector3(1, 1, 1),
      new Euler(0, Math.random() * Math.PI * 2, 0) // Рандомный поворот для декораций
    );

    // Для декораций можно сохранить instanceId, если нужно удалять их позже
    return { type: decoration.type, instanceId };
  }

  removeDecoration(type: TDecorationType, instanceId: number) {
    const mesh = this.decorationMeshes[type]
    if (mesh) {
      InstancedMeshManager.removeInstance(mesh, instanceId);
    }
  }

  removeCell(cell: TerrainCell) {
    const mesh = this.instancedMeshes[cell.level];
    if (mesh && cell.instanceId !== undefined) {
      InstancedMeshManager.removeInstance(mesh, cell.instanceId);
    }
  }

  getRandomCell(): TerrainCell {
    const availableCells = this.terrainCells.filter(cell => cell.isLand && cell.decorations.length === 0)
    const randomCellIndex = Math.floor(Math.random() * availableCells.length)

    return availableCells[randomCellIndex]
  }

  getRandomCells(count: number): TerrainCell[] {
    const availableCells = this.terrainCells.filter(cell => cell.isLand && cell.decorations.length === 0)
    
    if (count > availableCells.length) {
      throw new Error(`Requested ${count} cells but only ${availableCells.length} are available`)
    }

    // Используем массив индексов для отслеживания выбранных ячеек
    const availableIndices = Array.from({ length: availableCells.length }, (_, i) => i)
    const result: TerrainCell[] = []
    
    while (result.length < count) {
      // Получаем случайный индекс из оставшихся доступных индексов
      const randomPosition = Math.floor(Math.random() * availableIndices.length)
      const selectedIndex = availableIndices[randomPosition]
      
      // Удаляем использованный индекс из доступных
      availableIndices.splice(randomPosition, 1)
      
      // Добавляем ячейку в результат
      result.push(availableCells[selectedIndex])
    }

    return result
  }

  getTerrainCellByIntersection(intersection: Intersection<InstancedMesh>) {
    const hit = intersection
    if (hit.instanceId === undefined) {
      return null
    }

    const hitMesh = intersection.object
    const level = Object.keys(this.instancedMeshes).find(
      (key) => this.instancedMeshes[key as TTerrainLevel] === hitMesh
    ) as TTerrainLevel;

    if (!level) return;

    const targetCell = this.terrainCells.find(
      (cell) => cell.level === level && cell.instanceId === hit.instanceId
    );

    return targetCell
  }
}
