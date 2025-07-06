import { Terrain } from './entities/Terrain';
import { World } from './entities/World'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { DEFAULT_TERRAIN_SIZE } from './helpers/constants';

if (WebGL.isWebGL2Available()) {
  // Initiate function or other initializations here
  (async function () {
    // Create world
    const world = new World()
    const assets = await world.loadAssets()
    
    // Create Terrain
    const terrain = new Terrain(DEFAULT_TERRAIN_SIZE, assets)
    world.add(terrain)
  })()
} else {
  const warning = WebGL.getWebGL2ErrorMessage()
  document.getElementById('app')?.appendChild(warning)
}
