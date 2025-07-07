import { PMREMGenerator, Texture, TextureLoader, WebGLRenderer, FloatType } from "three";
import { GLTF, GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";
import { AssetsLoader } from "./AssetsLoader";
import { TERRAIN_LEVELS_TEXTURES } from "../helpers/constants";
import { TAssets } from "../helpers/types";

export class AssetsService {
  private renderer: WebGLRenderer;

  constructor(renderer: WebGLRenderer) {
    this.renderer = renderer;
  }

  public async loadAssets(): Promise<TAssets> {
    if (!this.renderer) {
      throw new Error("renderer isn't loaded yet");
    }

    const pmrem = new PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();

    // Load rgbe textures
    // Use FloatType for RGBELoader as in original code
    // Import FloatType from three if not already
    // @ts-ignore
    const rgbeLoader = new AssetsLoader(new RGBELoader().setDataType(FloatType));
    const rgbeTextures = {
      envmap: '/src/assets/textures/envmap.hdr'
    } as const;
    const loadedRGBTextures = await rgbeLoader.load<typeof rgbeTextures, Texture>(rgbeTextures);

    const rt = pmrem.fromEquirectangular(loadedRGBTextures.envmap as Texture);
    const envmap = rt.texture;

    // Load terrain textures
    const texturesLoader = new AssetsLoader(new TextureLoader());
    const loadedTerrainTextures = await texturesLoader
      .load<typeof TERRAIN_LEVELS_TEXTURES, Texture>(TERRAIN_LEVELS_TEXTURES);

    // Load models
    const modelsLoader = new AssetsLoader(new GLTFLoader());
    const models = {
      ms_1: '/src/assets/models/ms_1.glb',
      player_1: '/src/assets/models/player_style1.glb'
    };
    const loadedModels = await modelsLoader.load<typeof models, GLTF>(models);

    return {
      textures: {
        terrain: loadedTerrainTextures,
        envmap
      },
      models: loadedModels
    };
  }
}
