import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { PointLight, PointLightHelper } from "three";

export class LightingGUIController {
  private gui: GUI;
  private updateLight: () => void;

  constructor(gui: GUI, sunlight: PointLight, helper: PointLightHelper) {
    this.updateLight = () => helper.update();
    this.gui = gui;
    const lightningFolder = this.gui.addFolder('lightning');
    lightningFolder.open()

    this.gui.add(sunlight, 'intensity', 0, 1000, 1).onChange(this.updateLight);
    this.gui.add(sunlight, 'distance', 0, 200).onChange(this.updateLight);

    const positionFolder = lightningFolder.addFolder('position');
    positionFolder.add(sunlight.position, 'x', -20, 20).onChange(this.updateLight);
    positionFolder.add(sunlight.position, 'y', 0, 20).onChange(this.updateLight);
    positionFolder.add(sunlight.position, 'z', -20, 20).onChange(this.updateLight);
    positionFolder.open();

    const shadowMapSizeFolder = lightningFolder.addFolder('shadow map size');
    shadowMapSizeFolder.add(sunlight.shadow.mapSize, 'width', 0, 1024).onChange(this.updateLight);
    shadowMapSizeFolder.add(sunlight.shadow.mapSize, 'height', 0, 1024).onChange(this.updateLight);
    shadowMapSizeFolder.open();
  }
}
