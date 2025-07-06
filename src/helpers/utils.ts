import { WebGLRenderer } from "three"

export function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement
  const needResize = canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight

  if (needResize) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  }

  return needResize
}
