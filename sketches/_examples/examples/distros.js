import { Line } from '../tools/geo'
import { bounds, offset } from '../tools/geo'
import { Grid } from '../tools/geo/extended'
import { full } from '../tools/array'
import { mapRange } from '../tools/math'
import { setCanvasRange } from '../tools/canvas-utils'
import { draw } from '../tools/draw'

import { random, gaussian } from '../tools/random'
import { easeInQuad, easeInExpo, easeInOutCubic, easeOutInCubic } from '../tools/math/easings'

// Additional distribution functions
function beta(alpha, beta) {
    const gammaAlpha = gamma(alpha)
    const gammaBeta = gamma(beta)
    const gammaAlphaBeta = gamma(alpha + beta)
    return (gammaAlpha / (gammaAlpha + gammaBeta)) * gammaAlphaBeta
}

function gamma(shape) {
    let o = 0
    for (let i = 0; i < shape; i++) {
        o += -Math.log(Math.random())
    }
    return o
}

function gammaDistribution(shape, scale) {
    let d, c, x, xsquared, v, u
    if (shape < 1) {
        shape += 1
        d = shape - 1 / 3
        c = 1 / Math.sqrt(9 * d)
        do {
            do {
                x = gaussian(0, 1)
                v = Math.pow(1 + c * x, 3)
            } while (v <= 0)
            u = Math.random()
            xsquared = x * x
        } while (u > 1 - 0.331 * Math.pow(xsquared, 2) && Math.log(u) > 0.5 * xsquared + d * (1 - v + Math.log(v)))
        return d * v * scale
    } else {
        d = shape - 1 / 3
        c = 1 / Math.sqrt(9 * d)
        do {
            do {
                x = gaussian(0, 1)
                v = Math.pow(1 + c * x, 3)
            } while (v <= 0)
            u = Math.random()
            xsquared = x * x
        } while (u > 1 - 0.331 * Math.pow(xsquared, 2) && Math.log(u) > 0.5 * xsquared + d * (1 - v + Math.log(v)))
        return d * v * scale
    }
}

function logNormal(mean, stdDev) {
    const normalSample = gaussian(0, 1)
    return Math.exp(mean + stdDev * normalSample)
}

function poisson(lambda) {
    let L = Math.exp(-lambda)
    let k = 0
    let p = 1
    do {
        k++
        p *= Math.random()
    } while (p > L)
    return k - 1
}

const sampleCount = 25000
function fillRect(ctx, rect, color, randomFn) {
    // range to fill
    const [x0, y0] = rect.pos
    const [x1, y1] = rect.max
    // fill with samples
    const samples = full(sampleCount, () => randomFn(x0, y0, x1, y1))
    // draw
    draw(ctx, samples, { fill: color, weight: 0.002 })
}

export function distros(ctx, palette) {
    const [bg, primary, secondary] = palette

    const grid = new Grid([-1, -1], [2, 2], 3, 3)
    const rects = grid.rects().map((r) => offset(r, -0.02))

    // 1) UNIFORM
    fillRect(ctx, rects[0], primary, (x0, y0, x1, y1) => {
        return [random(x0, x1), random(y0, y1)]
    })
    // 2) EASE FN: ease in quad
    fillRect(ctx, rects[1], primary, (x0, y0, x1, y1) => {
        return [
            mapRange(easeInQuad(random()), 0, 1, x0, x1), //
            random(y0, y1),
        ]
    })
    // 3) EASE FN: ease in quad
    fillRect(ctx, rects[2], primary, (x0, y0, x1, y1) => {
        return [
            mapRange(easeInExpo(random()), 0, 1, x0, x1), //
            random(y0, y1),
        ]
    })
    // 4) EASE FN: ease in out cubic
    fillRect(ctx, rects[3], primary, (x0, y0, x1, y1) => {
        return [
            mapRange(easeInOutCubic(random()), 0, 1, x0, x1), //
            random(y0, y1),
        ]
    })
    // 5) EASE FN: ease in out cubic
    fillRect(ctx, rects[4], primary, (x0, y0, x1, y1) => {
        return [
            mapRange(easeOutInCubic(random()), 0, 1, x0, x1), //
            random(y0, y1),
        ]
    })
    // 6) EASE FN: gaussian
    fillRect(ctx, rects[4], primary, (x0, y0, x1, y1) => {
        return [
            // mapRange(easeInOutCubic(random()), 0, 1, x0, x1), //
            mapRange(easeOutInCubic(random()), 0, 1, x0, x1), //
            random(y0, y1),
        ]
    })

    draw(ctx, rects, { stroke: '#000', weight: 0.01 })

    // ctx.resetTransform()
    // setCanvasRange(ctx, -0.1, 1.1)

    // const count = 256
    // const height = 0.15

    // let lines = []
    // let yPos = 0.0

    // function lineWithRandomFn(fn) {
    //     return function () {
    //         const x = fn()
    //         return new Line([x, yPos], [x, yPos + height])
    //     }
    // }

    // // ## DISTRIBUTIONS (from bottom to top)
    // // # (1) uniform random (Math.random)
    // lines.push(full(count, lineWithRandomFn(random)))

    // // # using an easings function
    // yPos += height * 1.2
    // lines.push(
    //     full(
    //         count,
    //         lineWithRandomFn(() => gaussian(0.5, 0.1))
    //     )
    // )

    // // // # (2) normal (gausian) distribution
    // // yPos += height * 1.2
    // // lines.push(
    // //     full(
    // //         count,
    // //         lineWithRandomFn(() => gaussian(0.5, 0.1))
    // //     )
    // // )

    // // // # (3) beta distribution
    // // yPos += height * 1.2
    // // lines.push(
    // //     full(
    // //         count,
    // //         lineWithRandomFn(() => beta(2, 5))
    // //     )
    // // )

    // // // # (4) gamma distribution
    // // yPos += height * 1.2
    // // lines.push(
    // //     full(
    // //         count,
    // //         lineWithRandomFn(() => gammaDistribution(2, 1))
    // //     )
    // // )

    // // // # (5) log-normal distribution
    // // yPos += height * 1.2
    // // lines.push(
    // //     full(
    // //         count,
    // //         lineWithRandomFn(() => logNormal(0, 0.25))
    // //     )
    // // )

    // // // # (6) poisson distribution
    // // yPos += height * 1.2
    // // lines.push(
    // //     full(
    // //         count,
    // //         lineWithRandomFn(() => poisson(4) / 10) // Adjust scaling
    // //     )
    // // )

    // draw(ctx, lines, { stroke: primary, weight: 0.002 })
}
