import { Vector2 } from "three";

export class InputManager {
  public currentPointerPosition: Vector2;

  constructor() {
    this.currentPointerPosition = new Vector2();
    document.addEventListener('mousemove', this.onPointerMove);
  }

  private onPointerMove = (event: MouseEvent) => {
    this.currentPointerPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.currentPointerPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
}
