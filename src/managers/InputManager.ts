import { Camera, Raycaster, Vector2 } from "three";

export class InputManager {
  public currentPointerPosition: Vector2;
  public raycaster: Raycaster

  constructor() {
    this.currentPointerPosition = new Vector2();
    document.addEventListener('mousemove', this.onPointerMove);
    this.raycaster = new Raycaster();
  }

  // registerEvents now handled by InputManager
  public setRaycasterPosition (camera: Camera) {    
    this.raycaster.setFromCamera(this.currentPointerPosition, camera);
  }

  private onPointerMove = (event: MouseEvent) => {
    this.currentPointerPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.currentPointerPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
}
