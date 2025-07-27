import {
  Color,
  PerspectiveCamera,
  Raycaster,
  Scene,
} from "three"
import { CSS2DRenderer } from "three/examples/jsm/Addons.js"
import { AssetsService } from "../services/AssetsService"
import { TAssets } from "../helpers/types"

import { LightingManager } from "../managers/LightingManager"
import { LightingGUIController } from "../controllers/LightingGUIController"
import { LabelRendererManager } from "../managers/LabelRendererManager"
import { InputManager } from "../managers/InputManager"
import { RendererManager } from "../managers/RendererManager"
import { INITIAL_WORLD_CAMERA_ANGLE, INITIAL_WORLD_CAMERA_POSITION, WORLD_SIZE_UNIT_PX } from "../helpers/constants"
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js"
import { CameraGUIController } from "../controllers/CameraGUIController"

export class World extends Scene {
  public labelRenderer?: CSS2DRenderer
  public camera: PerspectiveCamera
  private assetsService: AssetsService
  private lightingManager: LightingManager
  private inputManager: InputManager
  private labelRendererManager?: LabelRendererManager
  private rendererManager: RendererManager
  private isDebug: boolean = !import.meta.env.PROD

  constructor() {
    super()
    const gui = new GUI()

    this.background = new Color('#FFEECC')

    if (this.isDebug) {
      // Label Renderer setup
      this.labelRendererManager = new LabelRendererManager();
      this.labelRenderer = this.labelRendererManager.labelRenderer;
    }

    // Camera setup
    const fov = 45
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 200
    this.camera = new PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(...Object.values(INITIAL_WORLD_CAMERA_POSITION) as [number, number, number])
    this.camera.rotation.set(...Object.values(INITIAL_WORLD_CAMERA_ANGLE) as [number, number, number])
    if (this.isDebug && this.labelRenderer) {
      new CameraGUIController(gui, this.camera, this.labelRenderer.domElement)
    }

    // Lighting setup
    this.lightingManager = new LightingManager(this);
    if (this.isDebug) {
      new LightingGUIController(gui, this.lightingManager.sunlight, this.lightingManager.sunlightHelper);
    }

    // Input Manager setup
    this.inputManager = new InputManager();

    // Renderer setup
    this.rendererManager = new RendererManager(this)
    const setRaycasterPositionWithCamera = this.inputManager.setRaycasterPosition.bind(
      this.inputManager,
      this.camera
    )
    this.rendererManager.addAnimateAction(setRaycasterPositionWithCamera);

    this.assetsService = new AssetsService(this.rendererManager.renderer);

    this.rendererManager.animate()
  }

  public getRaycaster (): Raycaster {
    return this.inputManager.raycaster
  }

  public getSize (): number {
    // Calculate world size based on user screen resolution
    // For example, base size on the minimum of width and height, scaled to a logical world unit
    const baseSize = 10; // fallback or minimum size
    if (typeof window === 'undefined') {
      return baseSize;
    }

    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const calculatedSize = Math.round(minDimension / WORLD_SIZE_UNIT_PX)
    
    return calculatedSize
  }
  
  public async loadAssets(): Promise<TAssets> {
    try {
      return await this.assetsService.loadAssets();
    } catch (error) {
      throw new Error(`'Assets didn't loaded with error: ${error instanceof Error ? error.message : error as string}`)
    }
  }
}
