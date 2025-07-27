import {
    Mesh,
    RepeatWrapping,
    Vector2,
    Color,
    Texture,
    MeshStandardMaterial,
    PlaneGeometry,
} from "three";
import { TAssets } from "../helpers/types";

export class Water extends Mesh {
    constructor(
        texture: Texture,
        envmap: TAssets["textures"]["envmap"],
        height: number,
        size: number
    ) {
        texture.repeat = new Vector2(1, 1)
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping

        super(
            new PlaneGeometry(size, size),
            new MeshStandardMaterial({
                color: new Color("#69daff").convertSRGBToLinear().multiplyScalar(2),
                envMap: envmap,
                envMapIntensity: 0.2,
                roughness: 0.8,
                metalness: 0.1,
                roughnessMap: texture,
                transparent: true,
                opacity: 0.7,
            })
        )

        this.receiveShadow = true
        this.rotation.x = -Math.PI * 0.5
        this.position.set(0, height * 0.5, 0)
    }
}