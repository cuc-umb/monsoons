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
  private labelRenderer: CSS2DRenderer
  public camera: PerspectiveCamera
  private assetsService: AssetsService
  private lightingManager: LightingManager 
  private inputManager: InputManager 
  private labelRendererManager: LabelRendererManager 
  private rendererManager: RendererManager 

  constructor() {
    super()
    const gui = new GUI()

    this.background = new Color('#FFEECC')

    // Label Renderer setup
    this.labelRendererManager = new LabelRendererManager();
    this.labelRenderer = this.labelRendererManager.labelRenderer;

    // Camera setup
    const fov = 45
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 200
    this.camera = new PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(...Object.values(INITIAL_WORLD_CAMERA_POSITION) as [number, number, number])
    this.camera.rotation.set(...Object.values(INITIAL_WORLD_CAMERA_ANGLE) as [number, number, number])
    new CameraGUIController(gui, this.camera, this.labelRenderer.domElement)

    // Lighting setup
    this.lightingManager = new LightingManager(this);
    new LightingGUIController(gui, this.lightingManager.sunlight, this.lightingManager.sunlightHelper);

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
  
  public async loadAssets(): Promise<TAssets> {
    try {
      return await this.assetsService.loadAssets();
    } catch (error) {
      throw new Error(`'Assets didn't loaded with error: ${error instanceof Error ? error.message : error as string}`)
    }
  }
}

