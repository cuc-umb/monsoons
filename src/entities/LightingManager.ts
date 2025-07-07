import { AmbientLight, DirectionalLight, PointLight, PointLightHelper, Color, Scene } from "three";

export class LightingManager {
  public sunlight: PointLight;
  public sunlightHelper: PointLightHelper;
  public ambientLight: AmbientLight;
  public directionalLight: DirectionalLight;

  constructor(scene: Scene) {
    // Ambient Light
    const skyColor = '#FFEECC';
    const skyLightIntensity = 0.4;
    this.ambientLight = new AmbientLight(skyColor, skyLightIntensity);
    scene.add(this.ambientLight);

    // Directional Light
    this.directionalLight = new DirectionalLight(0xFFFFFF, 1);
    this.directionalLight.position.set(0, 10, 0);
    scene.add(this.directionalLight);
    scene.add(this.directionalLight.target);

    // Sunlight (PointLight)
    const sunlightColor = new Color('#FFCB8E').convertSRGBToLinear();
    const sunlightIntensity = 1000;
    this.sunlight = new PointLight(sunlightColor, sunlightIntensity);
    this.sunlight.position.set(10, 20, 10);
    this.sunlight.castShadow = true;
    this.sunlight.shadow.mapSize.width = 512;
    this.sunlight.shadow.mapSize.height = 512;
    this.sunlight.shadow.camera.near = 0.5;
    this.sunlight.shadow.camera.far = 500;
    scene.add(this.sunlight);

    // Helper
    this.sunlightHelper = new PointLightHelper(this.sunlight);
    scene.add(this.sunlightHelper);
  }
}
