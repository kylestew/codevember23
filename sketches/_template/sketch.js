import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, Line, Rectangle } from './tools/geo/shapes'
import {
    centroid,
    asPath,
    asPolygon,
    vertices,
    bounds,
    scatter,
    translate,
    rotate,
    centerRotate,
} from './tools/geo/ops'
import { partition, range2d, shuffle, interleave } from './tools/array'
import { random } from './tools/random'
import { neg } from './tools/math/vectors'
import { draw } from './tools/draw'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const ctx = createCanvas(800, 800)
ctx.background(bg)
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
function tut03_cubic_disarray() {
    const rect = new Rectangle([-0.5, -0.5], [1, 1], { fill: primary })

    // create a grid of rectangles
    const tileSize = 0.25
    let rects = range2d([-1, 1], [-1, 1], tileSize, tileSize).map(
        (pt) => new Rectangle(pt, [tileSize, tileSize], { stroke: primary, fill: secondary, weight: 0.01 })
    )
    // distort the rectangles more and more based on index
    rects = rects.map((rect, idx) => {
        const pct = idx / rects.length
        const theta = pct * random(-Math.PI / 3, Math.PI / 3)
        return centerRotate(rect, theta)
    })

    draw(ctx, rects)
}

/* https://generativeartistry.com/tutorials/triangular-mesh/ */
function tut04_triangular_mesh() {}

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

function randomRectsFill() {
    const boundingRect = new Rectangle([-1, -1], [2, 2], { fill: '#333344' })
    // draw(ctx, boundingRect, { stroke: '#8899ee', weight: 0.01 })

    // clip to bounds
    ctx.clip(asPath(boundingRect))

    // 1st layer
    let pts = scatter(boundingRect, 24)
    const rects0 = pts.map((pt) =>
        Rectangle.fromCenterPoint(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: primary })
    )

    // 2nd layer
    pts = scatter(boundingRect, 24)
    const rects1 = pts.map((pt) =>
        Rectangle.fromCenterPoint(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: secondary })
    )

    draw(ctx, interleave(rects0, rects1))
}

// randomRectsFill()
// tut02_joy_division()
tut03_cubic_disarray()
