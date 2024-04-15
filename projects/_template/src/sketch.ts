import { SketchParams } from './types'
import { CanvasSketch, SketchState } from './util/Sketch'
import tinycolor from 'tinycolor2'
import { APC, polyline } from '@thi.ng/geom'
import { iterator, map } from '@thi.ng/transducers'
import { SYSTEM } from '@thi.ng/random'
import { draw } from '@thi.ng/hiccup-canvas'
import { chaikinCurve } from './lib/chaikin_curve'

export class MySketch extends CanvasSketch {
    private iteration = 0
    private shapes: APC[] = []

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, appElm, 100)
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
        this.iteration = 0
        this.shapes = []
    }

    next(): SketchState {
        if (this.iteration++ > this.params.iterations) {
            return { status: 'stopped', progress: 0 }
        }

        const xrange = this.randomRange(this.xrange[0] * 1.2, this.xrange[1] * 1.2, 0.5)
        const xys = iterator(
            map((x) => [x, SYSTEM.norm(0.8)]),
            xrange
        )
        const smooth = chaikinCurve([...xys], this.params.subdivisions)
        const pline = polyline(smooth, {
            stroke: tinycolor(this.params.tint).toRgbString(),
            weight: this.onePx * 9.0,
            closed: false,
            lineJoin: 'round',
            lineCap: 'round',
        })
        this.shapes = [pline]

        // sketch is in charge or rendering as needed
        this.render()

        return { status: 'running', progress: this.iteration / this.params.iterations }
    }

    private render() {
        const bgColor = tinycolor(this.params.background)
        draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])
    }
}
