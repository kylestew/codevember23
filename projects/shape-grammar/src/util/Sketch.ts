import { SketchParams } from '../types'
import { adaptiveCanvas2d } from '@thi.ng/canvas'

export type SketchState = {
    status: 'running' | 'stopped'
    progress: number
}

export interface ISketch {
    state: SketchState

    start(): void
    stop(): void
}

export abstract class Sketch implements ISketch {
    params: SketchParams
    state: SketchState = { status: 'stopped', progress: 0 }

    private frameDelay: number

    constructor(params: SketchParams, frameDelay: number = 1) {
        this.params = params
        this.frameDelay = frameDelay
    }

    abstract setup(): void
    abstract next(): SketchState

    async start() {
        this.setup()
        this.state = { status: 'running', progress: 0 }
        while (this.state.status === 'running') {
            this.state = this.next()

            // Pause for a short time (e.g., 100 milliseconds)
            // This allows the browser to update the UI
            await new Promise((resolve) => setTimeout(resolve, this.frameDelay))
        }
    }

    stop() {
        this.state = { status: 'stopped', progress: 0 }
    }
}

export abstract class CanvasSketch extends Sketch {
    ctx: CanvasRenderingContext2D
    width: number = 640
    height: number = 480
    onePx: number = 1.0
    xrange: number[] = [-1, 1]
    yrange: number[] = [-1, 1]

    constructor(params: SketchParams, appElm: HTMLElement, frameDelay: number = 1) {
        super(params, frameDelay)

        const dpr = window.devicePixelRatio || 1
        const { ctx } = adaptiveCanvas2d(this.width, this.height, appElm)
        this.ctx = ctx

        // scale canvas so shortest side is in range [-1, 1]
        if (this.width > this.height) {
            const scale = (this.height / 2.0) * dpr
            this.ctx.scale(scale, scale)
            this.ctx.translate((this.width * 0.5 * dpr) / scale, 1.0)
            this.onePx = (1.0 / scale) * dpr
            this.xrange = [-this.width / this.height, this.width / this.height]
        } else {
            const scale = (this.width / 2.0) * dpr
            this.ctx.scale(scale, scale)
            this.ctx.translate(1.0, (this.height * 0.5 * dpr) / scale)
            this.onePx = (1.0 / scale) * dpr
            this.yrange = [-this.height / this.width, this.height / this.width]
        }
        // flip canvas vertically
        this.ctx.scale(1, -1)
    }
}
