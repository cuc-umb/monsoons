import { World } from './entities/World'
import WebGL from 'three/addons/capabilities/WebGL.js'

if (WebGL.isWebGL2Available()) {
  // Initiate function or other initializations here
  (async function () {
    // Create world
    const world = new World()
    await world.loadAssets()
  })()
} else {
  const warning = WebGL.getWebGL2ErrorMessage()
  document.getElementById('app')?.appendChild(warning)
}
