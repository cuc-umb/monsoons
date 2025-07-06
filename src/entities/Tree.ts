import { CylinderGeometry, BufferGeometry, Vector3 } from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export class Tree extends BufferGeometry {
    constructor(position: Vector3) {
        super()

        const treeHeight = Math.random() * 1 + 1.25

        const geo = new CylinderGeometry(0, 1.5, treeHeight, 3)
        geo.translate(position.x, position.y + treeHeight * 0 + 1, position.z)

        const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3)
        geo2.translate(position.x, position.y + treeHeight * 0.6 + 1, position.z)

        const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3)
        geo3.translate(position.x, position.y + treeHeight * 1.25 + 1, position.z)

        this.copy(mergeGeometries([geo, geo2, geo3]))
    }
}