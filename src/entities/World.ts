import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  FloatType,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  PointLightHelper,
  Raycaster,
  Scene,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer
} from "three"
import { CSS2DRenderer, GLTF, GLTFLoader, OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js"
import { AssetsLoader } from "./AssetsLoader"
import { TERRAIN_LEVELS_TEXTURES } from "../helpers/constants"
import { TAssets } from "../helpers/types"
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js"
import { resizeRendererToDisplaySize } from "../helpers/utils"

export class World extends Scene {
  renderer: WebGLRenderer
  labelRenderer: CSS2DRenderer
  camera: PerspectiveCamera
  boundAnimate: () => void
  animateFunctions: ((...args: unknown[]) => unknown)[] = []
  currentPointerPosition: Vector2
  raycaster: Raycaster
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

    // Sky
    const skyColor = '#FFEECC' // light blue
    const skyLightIntensity = 0.4
    const skyLight = new AmbientLight(skyColor, skyLightIntensity)
    this.add(skyLight)

    // Sunlight
    const skyLight2 = new DirectionalLight(0xFFFFFF, 1)
    skyLight2.position.set(0, 10, 0)
    this.add(skyLight2)
    this.add(skyLight2.target)

    // Sunlight
    const sunlightColor = new Color('#FFCB8E').convertSRGBToLinear()
    const sunlighttIntensity = 1000
    const sunlight = new PointLight(sunlightColor, sunlighttIntensity)

    sunlight.position.set(10, 20, 10)
    sunlight.castShadow = true
    sunlight.shadow.mapSize.width = 512
    sunlight.shadow.mapSize.height = 512
    sunlight.shadow.camera.near = 0.5
    sunlight.shadow.camera.far = 500

    this.add(sunlight)

    const helper = new PointLightHelper(sunlight);
    this.add(helper);

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    gui.add(sunlight, 'intensity', 0, 1000, 1).onChange(updateLight);
    gui.add(sunlight, 'distance', 0, 200).onChange(updateLight);

    const positionFolder = gui.addFolder('position');
    positionFolder.add(sunlight.position, 'x', - 20, 20).onChange(updateLight);
    positionFolder.add(sunlight.position, 'y', 0, 20).onChange(updateLight);
    positionFolder.add(sunlight.position, 'z', - 20, 20).onChange(updateLight);
    positionFolder.open();

    const shadowMapSizeFolder = gui.addFolder('shadow map size');
    shadowMapSizeFolder.add(sunlight.shadow.mapSize, 'width', 0, 1024).onChange(updateLight);
    shadowMapSizeFolder.add(sunlight.shadow.mapSize, 'height', 0, 1024).onChange(updateLight);
    shadowMapSizeFolder.open();

    this.registerEvents()

    this.raycaster = new Raycaster()
    this.currentPointerPosition = new Vector2()
    this.addAnimateAction(this.setRaycasterPosition)

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'auto';
    document.body.appendChild(this.labelRenderer.domElement);

    const orbitControls = new OrbitControls(this.camera, this.labelRenderer.domElement)
    orbitControls.target.set(0, 5, 0)
    orbitControls.update()

    this.animate()
  }
  animate() {
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
  addAnimateAction(fn: (...args: unknown[]) => unknown) {
    this.animateFunctions.push(fn)
  }
  removeAnimateAction(fn: (...args: unknown[]) => unknown) {
    const fnIdx = this.animateFunctions.indexOf(fn)
    if (fnIdx !== -1) {
      this.animateFunctions.splice(fnIdx, 1)
    }
  }
  registerEvents() {
    const onPointerMove = (event: MouseEvent) => {
      this.currentPointerPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.currentPointerPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    document.addEventListener('mousemove', onPointerMove)
  }
  setRaycasterPosition () {    
    this.raycaster.setFromCamera(this.currentPointerPosition, this.camera);
  }
  async loadAssets(): Promise<TAssets> {
    try {
      if (!this.renderer) {
        throw new Error("'renderer isn't loaded yet")
      }

      const pmrem = new PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();

      // Load rgbe textures
      const rgbeLoader = new AssetsLoader(new RGBELoader().setDataType(FloatType))
      const rgbeTextures = {
        envmap: '/src/assets/textures/envmap.hdr'
      } as const
      const loadedRGBTextures = await rgbeLoader.load<typeof rgbeTextures, Texture>(rgbeTextures)

      const rt = pmrem.fromEquirectangular(loadedRGBTextures.envmap as Texture);
      const envmap = rt.texture

      // Load terrain textures
      const texturesLoader = new AssetsLoader(new TextureLoader())
      const loadedTerrainTextures = await texturesLoader
        .load<typeof TERRAIN_LEVELS_TEXTURES, Texture>
        (TERRAIN_LEVELS_TEXTURES)

      // Load models
      const modelsLoader = new AssetsLoader(new GLTFLoader())
      const models = {
        ms_1: '/src/assets/models/ms_1.glb',
        player_1: '/src/assets/models/player_style1.glb'
      }
      const loadedModels = await modelsLoader.load<typeof models, GLTF>(models)

      return {
        textures: {
          terrain: loadedTerrainTextures,
          envmap
        },
        models: loadedModels
      }
    } catch (error) {
      throw new Error(`'Assets didn't loaded with error: ${error instanceof Error ? error.message : error as string}`)
    }
  }
}

