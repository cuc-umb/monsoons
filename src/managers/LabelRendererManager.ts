import { CSS2DRenderer } from "three/examples/jsm/Addons.js";

export class LabelRendererManager {
  public labelRenderer: CSS2DRenderer;

  constructor() {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'auto';
    document.body.appendChild(this.labelRenderer.domElement);
  }
}
