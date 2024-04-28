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
import { FillType, renderFill } from './fills'

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

function filltextures() {
    const linesFill = renderFill(rect([0, 0], [w, h]), FillType.lines, 0.1, 10)
    drawToCanvas(texACtx, ['g', { __background: '#ff0' }, ...linesFill])
}

export function draw() {
    filltextures()

    // create base rect and apply subdivision algo
    const baseRect = rect([20, 20], [w - 40, h - 40])

    // split
    let rects = recursiveSplit(baseRect, true)

    // draw
    drawToCanvas(maskCtx, ['g', { __background: '#222' }, ...rects])

    // == OUTPUT to SHADER ===
    glClear([0, 0, 0, 1])
    useShader(shader)

    useTexture(gl.TEXTURE0, 'mask', maskCtx.canvas)
    useTexture(gl.TEXTURE1, 'textureA', texACtx.canvas)
    useTexture(gl.TEXTURE2, 'textureB', texBCtx.canvas)

    drawScreen()
}
draw()
