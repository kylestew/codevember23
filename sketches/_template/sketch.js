import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Line } from './tools/geo/shapes'
import { centerRotate } from './tools/geo/ops'
import { Grid } from './tools/geo/extended'
import { shuffle } from './tools/array'
import { draw } from './tools/draw'
import { bindGUI } from './gui'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const ctx = createCanvas(800, 800)
const { clearCanvas } = setCanvasRange(ctx, -1.1, 1.1)

const PARAMS = {
    rowColCount: 12,
    probability: 0.5,
}
bindGUI(run, (pane) => {
    pane.addBinding(PARAMS, 'rowColCount', { min: 1, max: 24, step: 1 })
    pane.addBinding(PARAMS, 'probability', { min: 0, max: 1, step: 0.01 })
})

function run() {
    clearCanvas(bg)

    // generate grid points
    const grid = new Grid([-1, -1], [2, 2], PARAMS.rowColCount, PARAMS.rowColCount)
    const pts = grid.centers()

    // create template line (centered at grid point)
    const cellSize = grid.cellSize[0]
    const backSlash = (pt) =>
        new Line([pt[0] - cellSize / 2.0, pt[1] - cellSize / 2.0], [pt[0] + cellSize / 2.0, pt[1] + cellSize / 2.0])

    // copy line to points applying attributes
    const lines = pts.map((pt) => {
        let line = backSlash(pt)
        return Math.random() <= PARAMS.probability ? line : centerRotate(line, Math.PI / 2)
    })

    draw(ctx, lines, { stroke: primary, lineCap: 'round', weight: 0.01 })
}
run()
