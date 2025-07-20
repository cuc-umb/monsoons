import { Camera } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export class CameraGUIController {
  private gui: GUI

  constructor(gui: GUI, camera: Camera, domElement?: HTMLElement | null) {
    this.gui = gui;
    
    const orbitControls = new OrbitControls(camera, domElement);
    orbitControls.update();
    
    const cameraFolder = this.gui.addFolder('camera');
    cameraFolder.open()

    const positionFolder = cameraFolder.addFolder('position');
    positionFolder.add(camera.position, 'x', -20, 80).listen()
    positionFolder.add(camera.position, 'y', 20, 100).listen()
    positionFolder.add(camera.position, 'z', -40, 80).listen()
    positionFolder.open();

    const angleFolder = cameraFolder.addFolder('angle');
    angleFolder.add(camera.rotation, 'x', -Math.PI, Math.PI).name('x (rad)').listen();
    angleFolder.add(camera.rotation, 'y', -Math.PI, Math.PI).name('y (rad)').listen();
    angleFolder.add(camera.rotation, 'z', -Math.PI, Math.PI).name('z (rad)').listen();
    angleFolder.open();
  }
}
