import {
    CylinderGeometry,
    Mesh,
    MeshPhysicalMaterial,
    RepeatWrapping,
    Vector2,
    Color,
    Texture,
} from "three";
import { TAssets } from "../helpers/types";

export class Water extends Mesh {
    constructor(
        texture: Texture,
        envmap: TAssets["textures"]["envmap"],
        height: number,
        radius: number
    ) {
        texture.repeat = new Vector2(1, 1)
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping

        super(
            new CylinderGeometry(radius, radius, height, 50),
            new MeshPhysicalMaterial({
                envMap: envmap,
                color: new Color("#69daff").convertSRGBToLinear().multiplyScalar(3),
                ior: 1.4,
                transmission: 1,
                transparent: true,
                thickness: 1.5,
                envMapIntensity: 0.2,
                roughness: 1,
                metalness: 0.025,
                roughnessMap: texture,
                metalnessMap: texture,
            })
        )

        this.receiveShadow = true
        this.rotation.y = -Math.PI * 0.333 * 0.5
        this.position.set(0, height * 0.5, 0)
    }
}