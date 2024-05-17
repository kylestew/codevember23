import { Line } from '../tools/geo/'
import { asPoints } from '../tools/geo/ops'
import { Grid } from '../tools/geo/extended'
import { draw } from '../tools/draw'

export function tiled_lines(ctx, palette) {
    const [bg, primary, secondary] = palette

    const probability = 0.3

    // generate grid cells
    const cellCount = 12
    const grid = new Grid([-1, -1], [2, 2], cellCount, cellCount)

    // for each grid cell, randomly pick a diagonal line across it
    const lines = grid.rects().map((rect) => {
        let pts = asPoints(rect)
        pts = Math.random() <= probability ? [pts[0], pts[2]] : [pts[1], pts[3]]
        return new Line(pts)
    })

    draw(ctx, lines, { stroke: primary, lineCap: 'round', weight: 0.01 })
}
