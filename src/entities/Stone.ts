import { SphereGeometry, Vector3 } from "three"

export class Stone extends SphereGeometry {
    constructor(position: Vector3) {
        const px = Math.random() * 0.4
        const pz = Math.random() * 0.4

        super(Math.random() * 0.3 + 0.1, 7, 7)
        this.translate(position.x + px, position.y, position.z + pz)
    }
}