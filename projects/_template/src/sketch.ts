import { createCanvas } from 'canvas-utils'
import { APC, polyline } from '@thi.ng/geom'
import { SYSTEM } from '@thi.ng/random'
import { iterator, map } from '@thi.ng/transducers'
import { draw } from '@thi.ng/hiccup-canvas'
import { chaikinCurve } from './lib/chaikin-curve'

export type SketchParams = {
    canvasSize: [number, number]
    background: string
    tint: string
    subdivisions: number
}

export class Sketch {
    private params: SketchParams
    private ctx: CanvasRenderingContext2D
    private shapes: APC[] = []

    constructor(params: SketchParams) {
        this.params = params
        this.ctx = createCanvas(params.canvasSize[0], params.canvasSize[1])
    }

    *randomRange(from: number, to: number, jumpScale: number): Generator<number> {
        let current = from
        while (current < to) {
            yield current
            current += SYSTEM.float(jumpScale)
        }
        yield to
    }

    reset() {
        this.next()
    }

    next() {
        const [w, h] = this.params.canvasSize
        const xrange = this.randomRange(-w * 0.1, w * 1.1, 50)
        const xys = iterator(
            map((x) => [x, SYSTEM.norm(h / 4) + h / 2]),
            xrange
        )

        const smooth = chaikinCurve([...xys], this.params.subdivisions)
        const pline = polyline(smooth, {
            stroke: this.params.tint,
            weight: 9.0,
            closed: false,
            lineJoin: 'round',
            lineCap: 'round',
        })
        this.shapes = [pline]

        // sketch is in charge or rendering as needed
        // or stopping rendering by not calling requestAnimationFrame
        this.render()
        // requestAnimationFrame(this.next.bind(this))
    }

    private render() {
        draw(this.ctx, ['g', { __background: this.params.background }, ...this.shapes])
    }
}
