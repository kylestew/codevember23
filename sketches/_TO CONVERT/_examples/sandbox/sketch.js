import { createCanvas, setCanvasRange } from 'canvas-utils'
import { circle, rect, bounds, area, rotate, translate } from '@thi.ng/geom'
// import { blobFromCircle } from './libs/geometry/blob'
import { draw } from '@thi.ng/hiccup-canvas'
import { map, interleave } from '@thi.ng/transducers'
import { madd } from '@thi.ng/vectors'
import { SYSTEM, uniform, gaussian, exponential } from '@thi.ng/random'

// https://sanzo-wada.dmbk.io/combination/263
const palette = ['#1b3644', '#a93400', '#f2ad78', '#b5ffc2']

const ctx = createCanvas(1200, 1920, 'sketchCanvas')
ctx.background(palette[0])
setCanvasRange(ctx, -1.2, 1.2)

const DEBUG = false

// x,y random functions need to be in range 0 to 1
// caller is in charge of bounding values
// RETURNS: circles to draw
function fillShape(shape, color, size = 0.005, density = 1000, xRandFn = uniform(), yRandFn = uniform()) {
    const rect = bounds(shape)
    if (DEBUG) {
        draw(ctx, ['g', { stroke: 'white', weight: 0.001 }, rect])
    }
    const count = area(rect) * density
    // draw(ctx, [
    //     'g',
    //     { fill: color },
    return [
        ...map(
            (pt) => circle(madd([], pt, rect.size, rect.pos), size, { fill: color }),
            Array.from({ length: count }, () => {
                return [xRandFn(), yRandFn()]
            })
        ),
    ]
    // ])
}

// bounding functions
function mirrorWrap(value) {
    const n = Math.floor(value)
    return n % 2 === 0 ? value - n : 1 - (value - n)
}
function wrapAround(value) {
    return value >= 0 ? value % 1 : (value % 1) + 1
}
// shaping functions
function compress(value, amt) {
    return Math.tanh(amt * value)
}

// look functions
function flame(rect, color, tightness = 3, spread = 1, invert = false) {
    const gauss = gaussian(SYSTEM, 24, 0.5, spread)
    return fillShape(
        rect,
        color,
        0.003,
        50000,
        () => {
            return gauss()
        },
        () => {
            if (invert) return 1.0 - compress(gauss(), tightness)
            else return compress(gauss(), tightness)
        }
    )
}
const circs1 = flame(rect([-0.5, -0.9], [1.0, 1.2]), palette[3] + '77', 3.0, 2.6)
const circs2 = flame(rect([-0.5, 0.3], [1.0, 1.0]), palette[1] + 'bb', 4, 3.5, true)

// draw(ctx, ['g', { stroke: 'white', weight: 0.001 }, rotate(rect(), 0.3)])

function interleaveArrays(array1, array2) {
    const result = []
    const maxLength = Math.max(array1.length, array2.length)

    for (let i = 0; i < maxLength; i++) {
        if (i < array1.length) {
            result.push(array1[i])
        }
        if (i < array2.length) {
            result.push(array2[i])
        }
    }

    return result
}

draw(ctx, ['g', {}, ...interleaveArrays(circs1, circs2)])
// draw(ctx, ['g', {}, ...circs1])
