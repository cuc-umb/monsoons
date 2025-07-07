import { InputManager } from "./InputManager"
import {
  ACESFilmicToneMapping,
  Color,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from "three"
import { CSS2DRenderer } from "three/examples/jsm/Addons.js"
import { AssetsService } from "./AssetsService"
import { TAssets } from "../helpers/types"
// import GUI from "three/examples/jsm/libs/lil-gui.module.min.js"
import { resizeRendererToDisplaySize } from "../helpers/utils"

import { LightingManager } from "./LightingManager"
import { LightingGUIController } from "./LightingGUIController"
import { LabelRendererManager } from "./LabelRendererManager"
import { OrbitControlsManager } from "./OrbitControlsManager"


export class World extends Scene {
  private renderer: WebGLRenderer
  private labelRenderer: CSS2DRenderer
  private camera: PerspectiveCamera
  private boundAnimate: () => void
  private animateFunctions: ((...args: unknown[]) => unknown)[] = []
  private currentPointerPosition: Vector2
  public raycaster: Raycaster
  private assetsService: AssetsService

  constructor() {
    super()
    this.background = new Color('#FFEECC')

    const canvas = document.getElementById('main-c') ?? undefined
    this.renderer = new WebGLRenderer({ antialias: true, canvas })
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.boundAnimate = this.animate.bind(this)

    // Camera
    const fov = 45
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 100
    this.camera = new PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(-17, 31, 33)


    // Lighting setup
    const lightingManager = new LightingManager(this);
    new LightingGUIController(lightingManager.sunlight, lightingManager.sunlightHelper);

    // Input Manager setup
    const inputManager = new InputManager();
    this.currentPointerPosition = inputManager.currentPointerPosition;

    this.raycaster = new Raycaster();
    this.addAnimateAction(this.setRaycasterPosition);


    // Label Renderer setup
    const labelRendererManager = new LabelRendererManager();
    this.labelRenderer = labelRendererManager.labelRenderer;


    // Orbit Controls setup
    new OrbitControlsManager(this.camera, this.labelRenderer.domElement);

    this.assetsService = new AssetsService(this.renderer);
    this.animate()
  }
  private animate() {
    if (resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }
    this.animateFunctions.forEach(fn => { fn.call(this) })
    this.renderer.render(this, this.camera)
    // this.labelRenderer.render(this, this.camera)
    requestAnimationFrame(this.boundAnimate)
  }
  public addAnimateAction(fn: (...args: unknown[]) => unknown) {
    this.animateFunctions.push(fn)
  }
  public removeAnimateAction(fn: (...args: unknown[]) => unknown) {
    const fnIdx = this.animateFunctions.indexOf(fn)
    if (fnIdx !== -1) {
      this.animateFunctions.splice(fnIdx, 1)
    }
  }
  // registerEvents now handled by InputManager
  private setRaycasterPosition () {    
    this.raycaster.setFromCamera(this.currentPointerPosition, this.camera);
  }
  public async loadAssets(): Promise<TAssets> {
    try {
      return await this.assetsService.loadAssets();
    } catch (error) {
      throw new Error(`'Assets didn't loaded with error: ${error instanceof Error ? error.message : error as string}`)
    }
  }
}

