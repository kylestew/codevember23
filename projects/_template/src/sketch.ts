import {
    createOffscreenCanvas,
    createGLCanvas,
    glClear,
    loadShader,
    useShader,
    useTexture,
    drawScreen,
} from 'canvas-utils'
import { SYSTEM, pickRandom } from '@thi.ng/random'
import { rect, Rect } from '@thi.ng/geom'
import { draw as drawToCanvas } from '@thi.ng/hiccup-canvas'

import vertexShaderSource from './shader.vert?raw'
import fragmentShaderSource from './shader.frag?raw'

const w = 1200
const h = 1200

// offscreen masking context
const maskCtx = createOffscreenCanvas(w, h)

// offscreen textures
const texACtx = createOffscreenCanvas(w, h)
const texBCtx = createOffscreenCanvas(w, h)
const texCCtx = createOffscreenCanvas(w, h)

// main drawing canvas
const gl = createGLCanvas(w, h)
const shader = loadShader(vertexShaderSource, fragmentShaderSource)!

function splitRect(geo: Rect, pct: number, horizontal: boolean): Rect[] {
    const [x, y] = geo.pos
    const [w, h] = geo.size
    if (horizontal) {
        const split = x + w * pct
        return [rect([x, y], [split - x, h]), rect([split, y], [w - (split - x), h])]
    } else {
        const split = y + h * pct
        return [rect([x, y], [w, split - y]), rect([x, split], [w, h - (split - y)])]
    }
}

// TODO: tune the splitting algorithm
function recursiveSplit(rect: Rect, horizontal: boolean, iteration = 0): Rect[] {
    // Base condition: if maximum recursion depth is reached, return the current rectangle in an array
    // OR randomly stop splitting
    if (iteration >= 6 || (iteration > 1 && Math.random() < 0.2)) {
        const randomFill = pickRandom(['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'])
        rect.attribs = { fill: randomFill }
        return [rect]
    }

    const pct = pickRandom([0.25, 0.5, 0.5, 0.5, 0.75])
    // const pct = SYSTEM.gaussian(0.5, 0.3, 0.2, 0.8) // Assuming truncatedGaussian is defined to ensure a valid split

    const [r0, r1] = splitRect(rect, pct, horizontal) // Assuming a split method that splits the rect and returns two sub-rectangles

    // Recursively split each resulting rectangle, toggle the split direction, and collect all rectangles
    const rects0 = recursiveSplit(r0, !horizontal, iteration + 1)
    const rects1 = recursiveSplit(r1, !horizontal, iteration + 1)

    return rects0.concat(rects1)
}

export function draw() {
    // create base rect and apply subdivision algo
    const baseRect = rect([20, 20], [w - 40, h - 40])

    // split
    let rects = recursiveSplit(baseRect, true)

    // set stroke
    rects.forEach((r) => {
        r.attribs = { fill: '#222', stroke: '#eee' }
    })

    // draw
    drawToCanvas(maskCtx, ['g', { __background: '#222' }, ...rects])

    // == OUTPUT to SHADER ===
    glClear([0, 0, 0, 1])
    useShader(shader)

    useTexture(gl.TEXTURE0, 'tex', maskCtx.canvas)
    // useTexture(gl.TEXTURE0, 'tex', colorSamplingCtx.canvas)

    drawScreen()
}

// import { SketchParams } from './types'
// import { CanvasSketch, SketchState } from './util/Sketch'
// import tinycolor from 'tinycolor2'
// import { APC, polyline } from '@thi.ng/geom'
// import { iterator, map } from '@thi.ng/transducers'
// import { SYSTEM } from '@thi.ng/random'
// import { draw } from '@thi.ng/hiccup-canvas'
// import { chaikinCurve } from './lib/chaikin_curve'

/*
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
*/
