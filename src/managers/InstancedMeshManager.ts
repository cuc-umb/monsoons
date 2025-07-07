import { Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from "three";

export class InstancedMeshManager {
  static addInstance(
    mesh: InstancedMesh,
    position: Vector3,
    scale: Vector3 = new Vector3(1, 1, 1),
    rotation?: Euler
  ): number {
    const instanceId = mesh.count;
    const matrix = new Matrix4();

    matrix.compose(
      position,
      rotation ? new Quaternion().setFromEuler(rotation) : new Quaternion(),
      scale
    );

    mesh.setMatrixAt(instanceId, matrix);
    mesh.count++;
    mesh.instanceMatrix.needsUpdate = true;
    return instanceId;
  }

  static removeInstance(mesh: InstancedMesh, instanceId: number) {
    for (let i = instanceId; i < mesh.count - 1; i++) {
      const matrix = new Matrix4();
      mesh.getMatrixAt(i + 1, matrix);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.count--;
    mesh.instanceMatrix.needsUpdate = true;
  }
}