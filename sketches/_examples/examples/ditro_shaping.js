import { Line } from '../tools/geo'
import { bounds, offset } from '../tools/geo'
import { Grid } from '../tools/geo/extended'
import { full } from '../tools/array'
import { mapRange, clamp } from '../tools/math'
import { setCanvasRange } from '../tools/canvas-utils'
import { draw } from '../tools/draw'

import { random, gaussian } from '../tools/random'
import { easeInQuad, easeInExpo, easeInOutCubic, easeOutInCubic } from '../tools/math/easings'

export function distroShaping(ctx, palette) {
    const [bg, primary, secondary] = palette

    const grid = new Grid([-1, -1], [2, 2], 3, 2)
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
    fillRect(ctx, rects[5], primary, (x0, y0, x1, y1) => {
        return [
            // mapRange(easeInOutCubic(random()), 0, 1, x0, x1), //
            mapRange(clamp(gaussian(0.5, 0.15)), 0, 1, x0, x1), //
            random(y0, y1),
        ]
    })

    draw(ctx, rects, { stroke: '#000', weight: 0.01 })

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
