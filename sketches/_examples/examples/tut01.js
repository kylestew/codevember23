import { Line } from '../tools/geo/'
import { asPoints } from '../tools/geo/ops'
import { Grid } from '../tools/geo/extended'
import { draw } from '../tools/draw'

export function tiled_lines(ctx, palette) {
    const [bg, primary, secondary] = palette

    const probability = 0.5

    // generate grid cells
    const cellCount = 12
    const grid = new Grid([-1, -1], [2, 2], cellCount, cellCount)

    // for each grid cell, randomly pick a diagonal line across it (forward or backward)
    const lines = grid.rects().map((rect) => {
        let [a, b, c, d] = asPoints(rect)
        const pts = Math.random() <= probability ? [a, c] : [b, d]
        return new Line(pts)
    })

    draw(ctx, lines, { stroke: primary, lineCap: 'round', weight: 0.01 })
}
