import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { PointLight, PointLightHelper } from "three";

export class LightingGUIController {
  private gui: GUI;
  private updateLight: () => void;

  constructor(sunlight: PointLight, helper: PointLightHelper) {
    this.updateLight = () => helper.update();
    this.gui = new GUI();
    this.gui.add(sunlight, 'intensity', 0, 1000, 1).onChange(this.updateLight);
    this.gui.add(sunlight, 'distance', 0, 200).onChange(this.updateLight);

    const positionFolder = this.gui.addFolder('position');
    positionFolder.add(sunlight.position, 'x', -20, 20).onChange(this.updateLight);
    positionFolder.add(sunlight.position, 'y', 0, 20).onChange(this.updateLight);
    positionFolder.add(sunlight.position, 'z', -20, 20).onChange(this.updateLight);
    positionFolder.open();

    const shadowMapSizeFolder = this.gui.addFolder('shadow map size');
    shadowMapSizeFolder.add(sunlight.shadow.mapSize, 'width', 0, 1024).onChange(this.updateLight);
    shadowMapSizeFolder.add(sunlight.shadow.mapSize, 'height', 0, 1024).onChange(this.updateLight);
    shadowMapSizeFolder.open();
  }
}
