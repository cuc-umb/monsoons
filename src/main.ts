import { Terrain } from './entities/Terrain';
import { World } from './entities/World'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { DEFAULT_TERRAIN_SIZE } from './helpers/constants';
import { Player } from './entities/Player';

if (WebGL.isWebGL2Available()) {
  // Initiate function or other initializations here
  (async function () {
    // Create world
    const world = new World()
    const assets = await world.loadAssets()
    
    // Create Terrain
    const terrain = new Terrain(DEFAULT_TERRAIN_SIZE, assets)
    world.add(terrain)

    const playerCell = terrain.getRandomCell()
    const player = new Player(assets.models.player_1, playerCell, 4)
    player.addAction(player.clickOnTerrain, world.raycaster, terrain)
    world.add(player)
  })()
} else {
  const warning = WebGL.getWebGL2ErrorMessage()
  document.getElementById('app')?.appendChild(warning)
}
