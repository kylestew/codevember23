import { SketchParams } from './types'
import { Sketch } from './util/ISketch'
import tinycolor from 'tinycolor2'
import { adaptiveCanvas2d } from '@thi.ng/canvas'
import { draw } from '@thi.ng/hiccup-canvas'
import { circle, Circle } from '@thi.ng/geom'
import { SYSTEM } from '@thi.ng/random'

export class MySketch extends Sketch {
    private ctx: CanvasRenderingContext2D
    private width: number = 640
    private height: number = 480

    private shapes: Circle[] = []

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
        } else {
            const scale = (this.width / 2.0) * dpr
            this.ctx.scale(scale, scale)
            this.ctx.translate(1.0, (this.height * 0.5 * dpr) / scale)
        }
    }

    // *circleGenerator(count: number): Generator<Circle, void, undefined> {
    //     for (let i = 0; i < count; i++) {
    //         yield circle(
    //             [SYSTEM.float(this.width * this.dpr), SYSTEM.float(this.height * this.dpr)],
    //             SYSTEM.float(100 * this.dpr),
    //             { fill: tinycolor(this.params.tint).toRgbString() }
    //         )
    //     }
    // }

    setup() {
        this.shapes = []
        console.log('restarting', this.params.subdivisions)
        // this.generator = this.circleGenerator(100)
    }

    update(iteration: number): number {
        // const next = this.generator.next()
        // if (next.done) {
        this.stop()
        // } else {
        //     this.shapes.push(next.value)
        // }
        // return iteration
    }

    render() {
        // const bgColor = tinycolor(this.params.background)
        // draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])
    }
}
