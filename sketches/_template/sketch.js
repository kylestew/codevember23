import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, Line, vertices } from './tools/geo'
import { partition, range2d } from './tools/array'
import { draw } from './tools/draw'

const ctx = createCanvas(800, 800)
ctx.background('#333344')
setCanvasRange(ctx, -1.0, 1.0)

/* https://generativeartistry.com/tutorials */
function tut01_tiled_lines() {
    const cellSize = 0.25
    const pts = range2d([-1, 1], [-1, 1], cellSize, cellSize)

    const forwardSlash = (pt) => new Line([pt[0], pt[1]], [pt[0] + cellSize, pt[1] + cellSize])
    const backSlash = (pt) => new Line([pt[0], pt[1] + cellSize], [pt[0] + cellSize, pt[1]])

    // grid pts -> lines
    const lines = pts.map((pt) => {
        return Math.random() <= 0.5 ? forwardSlash(pt) : backSlash(pt)
    })

    draw(ctx, lines, { stroke: '#ffffff', lineCap: 'round', weight: 0.01 })
}

function drawColorWheel() {
    // circle -> vertices -> partition into pairs -> map to polygons using center point
    const WEDGE_COUNT = 24
    const circ = new Circle([0, 0], 1)
    const verts = vertices(circ, WEDGE_COUNT)
    verts.push(verts[0]) // loop back to the start
    const polys = partition(verts, 2, 1, false).map(
        (pair, idx) => new Polygon([pair[0], pair[1], [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
    )

    draw(ctx, polys)
    draw(ctx, circ, { stroke: '#ffffff', weight: 0.05 })
}

function drawCircleGrid() {
    const cellSize = 0.25
    const pts = range2d([-1, 1], [-1, 1], cellSize, cellSize)

    // grid pts -> to circles -> draw
    const circs = pts.map((pt) => {
        return new Circle(pt, cellSize / 2)
    })

    draw(ctx, circs, { stroke: '#ffffff', weight: 0.01 })
}

tut01_tiled_lines()
