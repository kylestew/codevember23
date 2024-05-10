import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, Line, Rectangle } from './tools/geo/shapes'
import { vertices, bounds, scatter } from './tools/geo/ops'
import { partition, range2d } from './tools/array'
import { draw } from './tools/draw'

const ctx = createCanvas(800, 800)
ctx.background('#333344')
setCanvasRange(ctx, -1.1, 1.1)

/* https://generativeartistry.com/tutorials */
function tut01_tiled_lines() {
    const cellSize = 0.1
    const pts = range2d([-1, 1], [-1, 1], cellSize, cellSize)

    const forwardSlash = (pt) => new Line([pt[0], pt[1]], [pt[0] + cellSize, pt[1] + cellSize])
    const backSlash = (pt) => new Line([pt[0], pt[1] + cellSize], [pt[0] + cellSize, pt[1]])

    // grid pts -> lines
    const lines = pts.map((pt) => {
        return Math.random() <= 0.5 ? forwardSlash(pt) : backSlash(pt)
    })

    draw(ctx, lines, { stroke: '#ffffff', lineCap: 'round', weight: 0.01 })
}

/* https://generativeartistry.com/tutorials/joy-division/ */
function tut02_joy_division() {
    // make a list of horizontal lines
    // convert to points
    // randomly distrub those points
    // shaope the distrubed points to apply mostly in the middle
    // chaickin curve the points
    // convert to polyline and draw
}

/* https://generativeartistry.com/tutorials/cubic-disarray/ */
function tut03_cubic_disarray() {}

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

function randomRects() {
    // fill the canvas mostly with random rects
    // TODO: clip to bounds
    const boundingRect = new Rectangle([-1, -1], [2, 2], { fill: '#333344' })

    // const bnd = bounds(boundingRect)
    // bnd.attribs.fill = 'red'

    const pts = scatter(boundingRect, 100000)

    // console.log(boundingRect, bnd)

    draw(ctx, boundingRect, { stroke: '#8899ee', weight: 0.01 })
    draw(ctx, pts, { stroke: '#ffffff99', weight: 0.002 })
}

// tut02_joy_division()
randomRects()
