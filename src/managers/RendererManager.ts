import { ACESFilmicToneMapping, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { resizeRendererToDisplaySize } from "../helpers/utils"
import { CSS2DRenderer } from "three/examples/jsm/Addons.js"

type SceneToRender = Scene & {
    camera: PerspectiveCamera,
    labelRenderer?: CSS2DRenderer
}

export class RendererManager {
    public renderer: WebGLRenderer
    private boundAnimate: () => void
    private animateFunctions: ((...args: unknown[]) => unknown)[] = []
    private isDebug = !import.meta.env.PROD
    
    constructor(animatedSceneCtx: SceneToRender) {
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
    private animateSetup (this: RendererManager, sceneCtx: SceneToRender) {
        if (resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement
            sceneCtx.camera.aspect = canvas.clientWidth / canvas.clientHeight
            sceneCtx.camera.updateProjectionMatrix()
        }
        this.animateFunctions.forEach(fn => { fn.call(this) })
        this.renderer.render(sceneCtx, sceneCtx.camera)
        if (this.isDebug) {
            sceneCtx.labelRenderer?.render?.(sceneCtx, sceneCtx.camera)
        }
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
