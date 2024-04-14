import { SketchParams } from './types'
import { Sketch } from './util/ISketch'
import tinycolor from 'tinycolor2'
import { adaptiveCanvas2d } from '@thi.ng/canvas'
import { APC, polyline } from '@thi.ng/geom'
import { Vec } from '@thi.ng/vectors'
import { range, transduce, map, push } from '@thi.ng/transducers'
import { SYSTEM } from '@thi.ng/random'
import { draw } from '@thi.ng/hiccup-canvas'

export class MySketch extends Sketch {
    private ctx: CanvasRenderingContext2D
    private width: number = 640
    private height: number = 480
    private onePx: number = 1.0
    private xrange: number[] = [-1, 1]
    private yrange: number[] = [-1, 1]

    private shapes: APC[] = []

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, 100)

        const dpr = window.devicePixelRatio || 1
        const { ctx } = adaptiveCanvas2d(this.width, this.height, appElm)
        this.ctx = ctx

        // scale canvas so shortest side is in range [-1, 1]
        if (this.width > this.height) {
            const scale = (this.height / 2.0) * dpr
            this.ctx.scale(scale, scale)
            this.ctx.translate((this.width * 0.5 * dpr) / scale, 1.0)
            this.onePx = 1.0 / scale / dpr
            this.xrange = [-this.width / this.height, this.width / this.height]
        } else {
            const scale = (this.width / 2.0) * dpr
            this.ctx.scale(scale, scale)
            this.ctx.translate(1.0, (this.height * 0.5 * dpr) / scale)
            this.onePx = 1.0 / scale / dpr
            this.yrange = [-this.height / this.width, this.height / this.width]
        }
    }

    *randomRange(from: number, to: number, jumpScale: number): Generator<number> {
        let current = from
        while (current < to) {
            yield current
            current += SYSTEM.float(jumpScale)
        }
        yield to
    }

    setup() {
        this.shapes = []
    }

    update(iteration: number): number {
        if (iteration < 100) {
            const xrange = this.randomRange(this.xrange[0], this.xrange[1], 0.5)
            const xys = transduce(
                map((x) => [x, SYSTEM.norm(0.8)]),
                push<Vec>(),
                xrange
            )
            const pline = polyline(xys, {
                stroke: tinycolor(this.params.tint).toRgbString(),
                weight: this.onePx * 18.0,
                closed: false,
                lineJoin: 'round',
            })
            this.shapes = [pline]

            // TODO: apply chaikin curve subdivision "subdivision" times
        } else {
            this.stop()
        }
        return iteration
    }

    render() {
        const bgColor = tinycolor(this.params.background)
        draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])
    }
}
