import { translate, offset, withAttribs } from '../tools/geo/ops'
import { Grid } from '../tools/geo/extended'
import { full, zip, linspace } from '../tools/array'
import { randomOffset } from '../tools/random'
import { mapRange, lerpPt } from '../tools/math'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils'
import { simplex3 } from '../tools/random/noise'

// /* https://generativeartistry.com/tutorials/hypnotic-squares/ */
export function hypnotic_squares(ctx, palette) {
    const [bg, primary, secondary] = palette

    // create a grid
    const grid = new Grid([-1, -1], [2, 2], 8, 8)

    function render(time) {
        ctx.clear(bg)

        // generate a list off offsets for each smallest square
        const cellSize = grid.cellSize
        // const randomizedOffsets = full(grid.cellCount, () => randomOffset(cellSize[0] / 4.0, cellSize[1] / 4.0))
        const randomizedOffsets = grid
            .centers()
            .map(([x, y]) => [0.1 * simplex3(x, y, time * 0.0001), 0.1 * simplex3(x, y, time * -0.001)])

        // lerp squares from grid rect towards center point
        const squareCount = 5
        const smallSquarePct = 0.45
        const squares = zip(grid.rects(), randomizedOffsets).map(([rect, randOffset]) =>
            // stack of squares in each grid cell
            linspace(0, 1, squareCount).map((pct) => {
                const size = mapRange(pct, 0, 1, 0, cellSize[0] * smallSquarePct)
                const trx = lerpPt([0, 0], randOffset, pct)
                // rect inset by size and translated by lerped offset
                const newRect = translate(offset(rect, -size), trx)
                if (pct > 0.8) {
                    return withAttribs(newRect, { stroke: secondary, weight: 0.01 })
                } else {
                    return withAttribs(newRect, { stroke: primary, weight: 0.01 })
                }
            })
        )
        draw(ctx, squares, { stroke: primary, weight: 0.01 })
    }
    animate(10, render)
}
