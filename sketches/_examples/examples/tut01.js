import { Line } from '../tools/geo/'
import { centerRotate } from '../tools/geo/ops'
import { Grid } from '../tools/geo/extended'
import { draw } from '../tools/draw'

export function tiled_lines(ctx, palette) {
    const [bg, primary, secondary] = palette

    const cellCount = 12

    // generate grid points
    const grid = new Grid([-1, -1], [2, 2], cellCount, cellCount)
    const pts = grid.centers()

    // create template line (centered at grid point)
    const cellSize = grid.cellSize[0]
    const backSlash = (pt) =>
        new Line([pt[0] - cellSize / 2.0, pt[1] - cellSize / 2.0], [pt[0] + cellSize / 2.0, pt[1] + cellSize / 2.0])

    // copy line to points applying attributes
    const lines = pts.map((pt) => {
        let line = backSlash(pt)
        return Math.random() <= 0.5 ? line : centerRotate(line, Math.PI / 2)
    })

    draw(ctx, lines, { stroke: primary, lineCap: 'round', weight: 0.01 })
}
