import { adaptiveCanvas2d } from '@thi.ng/canvas'
import { Sketch, SketchParams } from './types'
import tinycolor from 'tinycolor2'
import { draw } from '@thi.ng/hiccup-canvas'
import { circle, Circle } from '@thi.ng/geom'
import { SYSTEM } from '@thi.ng/random'

export class MySketch extends Sketch {
    private ctx: CanvasRenderingContext2D
    private dpr: number
    private width: number = 640
    private height: number = 480

    private generator: Generator<Circle, void, undefined> = this.circleGenerator(0)
    private shapes: Circle[] = []

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, 100)

        this.dpr = window.devicePixelRatio || 1
        const { ctx } = adaptiveCanvas2d(this.width, this.height, appElm)
        this.ctx = ctx
    }

    *circleGenerator(count: number): Generator<Circle, void, undefined> {
        for (let i = 0; i < count; i++) {
            yield circle(
                [SYSTEM.float(this.width * this.dpr), SYSTEM.float(this.height * this.dpr)],
                SYSTEM.float(100 * this.dpr),
                { fill: tinycolor(this.params.tint).toRgbString() }
            )
        }
    }

    setup() {
        this.shapes = []
        this.generator = this.circleGenerator(100)
    }

    update(iteration: number): number {
        const next = this.generator.next()
        if (next.done) {
            this.stop()
        } else {
            this.shapes.push(next.value)
        }
        return iteration
    }

    render() {
        const bgColor = tinycolor(this.params.background)
        draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])
    }
}
