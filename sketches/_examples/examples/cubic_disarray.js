import { translate, centerRotate } from '../tools/geo/ops'
import { Grid } from '../tools/geo/extended'
import { random } from '../tools/random'
import { mapRange } from '../tools/math'
import { draw } from '../tools/draw'

/* https://generativeartistry.com/tutorials/cubic-disarray/ */
export function cubic_disarray(ctx, palette) {
    const [bg, primary, secondary] = palette

    // create a grid of rectangles
    const columnCount = 8
    let grid = new Grid([-1, -1], [2, 2], columnCount, columnCount)

    console.log(grid.centers())

    // // for each grid cell, rotate and translate randomly scaled by index
    // const rects = grid.rects().map((rect, idx) => {
    //     const pct = mapRange(idx, 0, grid.cellCount, 0, 1)
    //     const theta = pct * random(-Math.PI / 6, Math.PI / 6)
    //     const sz = grid.cellSize
    //     const offset = [pct * sz[0] * random(-0.5, 0.5), pct * sz[1] * random(0.0, 0.2)]
    //     return translate(centerRotate(rect, theta), offset)
    // })
    // draw(ctx, rects, { fill: primary, stroke: secondary, weight: 0.01 })
}
