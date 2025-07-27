import { SphereGeometry, Mesh, BufferGeometry, MeshLambertMaterial } from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

export class Cloud extends Mesh {
    constructor() {
        let geo = new SphereGeometry(0, 0, 0) as BufferGeometry

        const puff1 = new SphereGeometry(1.2, 7, 7)
        const puff2 = new SphereGeometry(1.5, 7, 7)
        const puff3 = new SphereGeometry(0.9, 7, 7)

        puff1.translate(-1.85, Math.random() * 0.3, 0)
        puff2.translate(0, Math.random() * 0.3, 0)
        puff3.translate(1.85, Math.random() * 0.3, 0)

        const cloudGeo = mergeGeometries([puff1, puff2, puff3])
        cloudGeo.translate(
            Math.random() * 20 - 10,
            Math.random() * 7 + 7 + 3,
            Math.random() * 20 - 10
        )
        cloudGeo.rotateY(Math.random() * Math.PI * 2)

        geo = mergeGeometries([geo, cloudGeo])

        const material = new MeshLambertMaterial({
            flatShading: true,
        })

        super(geo, material)
    }
}