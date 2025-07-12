import { ACESFilmicToneMapping, Object3D, PCFSoftShadowMap, PerspectiveCamera, WebGLRenderer } from "three"
import { resizeRendererToDisplaySize } from "../helpers/utils"

type SceneWithCamera = Object3D & { camera: PerspectiveCamera }

export class RendererManager {
    public renderer: WebGLRenderer
    private boundAnimate: () => void
    private animateFunctions: ((...args: unknown[]) => unknown)[] = []
    
    constructor(animatedSceneCtx: SceneWithCamera) {
        const canvas = document.getElementById('main-c') ?? undefined
        this.renderer = new WebGLRenderer({ antialias: true, canvas })
        this.renderer.toneMapping = ACESFilmicToneMapping
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap

        this.boundAnimate = this.animateSetup.bind(this, animatedSceneCtx)
    }

    public animate() {
        this.boundAnimate()
    }
    private animateSetup (this: RendererManager, sceneCtx: SceneWithCamera) {
        if (resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement
            sceneCtx.camera.aspect = canvas.clientWidth / canvas.clientHeight
            sceneCtx.camera.updateProjectionMatrix()
        }
        this.animateFunctions.forEach(fn => { fn.call(this) })
        this.renderer.render(sceneCtx, sceneCtx.camera)
        // this.labelRenderer.render(this, this.camera)
        requestAnimationFrame(this.boundAnimate)
    }

    public addAnimateAction(fn: (...args: unknown[]) => unknown) {
        this.animateFunctions.push(fn)
    }

    public removeAnimateAction(fn: (...args: unknown[]) => unknown) {
        const fnIdx = this.animateFunctions.indexOf(fn)
        if (fnIdx !== -1) {
            this.animateFunctions.splice(fnIdx, 1)
        }
    }
}
