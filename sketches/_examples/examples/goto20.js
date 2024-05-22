import { Line } from '../tools/geo/'
import { asPoints } from '../tools/geo/ops'
import { Grid } from '../tools/geo/extended'
import { random, randomInt } from '../tools/random'
import { shuffle } from '../tools/array'
import { color } from '../tools/color'
import { createOffscreenCanvas } from '../tools/canvas-utils'
import { floodFillAlgorithm } from '../tools/tex/flood-fill'
import { draw } from '../tools/draw'

export function goto20(ctx, palette) {
    const [bg, primary, secondary] = palette

    const offCtx = createOffscreenCanvas(ctx.canvas.width, ctx.canvas.height)
    offCtx.setRange(-1.1, 1.1)

    const probability = 0.5
    const cellCount = 12
    function doGoto() {
        offCtx.clear('white')

        // generate grid cells
        const grid = new Grid([-1.2, -1.2], [2.4, 2.4], cellCount, cellCount)
        const cells = grid.rects()

        // for each grid cell, randomly pick a diagonal line across it (forward or backward)
        const lines = cells.map((rect) => {
            let [a, b, c, d] = asPoints(rect)
            const pts = Math.random() <= probability ? [a, c] : [b, d]
            return new Line(pts)
        })

        draw(offCtx, lines, { stroke: primary, lineCap: 'round', weight: 0.03 })
    }

    // fill 1
    doGoto()
    let pt = [random(-0.8, 0.8), random(-0.8, 0.8)]
    floodFillAlgorithm(offCtx, pt, color(primary).toArray(), ctx)

    // fill 1
    doGoto()
    pt = [random(-0.8, 0.8), random(-0.8, 0.8)]
    floodFillAlgorithm(offCtx, pt, color(secondary).toArray(), ctx)

    doGoto()
    pt = [random(-0.8, 0.8), random(-0.8, 0.8)]
    floodFillAlgorithm(offCtx, pt, color(primary).toArray(), ctx)
    doGoto()
    pt = [random(-0.8, 0.8), random(-0.8, 0.8)]
    floodFillAlgorithm(offCtx, pt, color(secondary).toArray(), ctx)
    doGoto()
    pt = [random(-0.8, 0.8), random(-0.8, 0.8)]
    floodFillAlgorithm(offCtx, pt, color(primary).toArray(), ctx)
    pt = [random(-0.8, 0.8), random(-0.8, 0.8)]
    floodFillAlgorithm(offCtx, pt, color(secondary).toArray(), ctx)
    doGoto()
    pt = [random(-0.8, 0.8), random(-0.8, 0.8)]
    floodFillAlgorithm(offCtx, pt, color(primary).toArray(), ctx)
}
