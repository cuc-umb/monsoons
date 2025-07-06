import {
    CylinderGeometry,
    Mesh,
    MeshPhysicalMaterial,
    DoubleSide,
    Texture,
    Group,
    CircleGeometry,
} from "three";
import { TAssets } from "../helpers/types";

const radialSegments = 50

export class Border extends Group {
    constructor(
        texture: Texture,
        envmap: TAssets["textures"]["envmap"],
        height: number,
        radius: number
    ) {
        super();
        const containerBorderHeight = (height * 0.125) - 0.1
        const containerMaterial = new MeshPhysicalMaterial({
            envMap: envmap,
            map: texture,
            envMapIntensity: 0.2,
            side: DoubleSide,
        })

        const borderMesh = new Mesh(
            new CylinderGeometry(radius, radius, height * 0.4, radialSegments, 1, true),
            containerMaterial
        )
        borderMesh.receiveShadow = true
        borderMesh.rotation.y = -Math.PI * 0.333
        borderMesh.position.set(0, containerBorderHeight, 0)

        this.add(borderMesh)

        const undersideMesh = new Mesh(
            new CircleGeometry(radius, radialSegments),
            containerMaterial
        )
        undersideMesh.rotation.x = -Math.PI * 0.5

        undersideMesh.position.set(0, -0.1, 0)

        this.add(undersideMesh)
    }
}