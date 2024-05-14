import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, Polyline, Line, Rectangle } from './tools/geo/shapes'
import {
    centroid,
    asPath,
    asPoints,
    asPolygon,
    bounds,
    scatter,
    translate,
    resample,
    rotate,
    centerRotate,
} from './tools/geo/ops'
import { partition, zip, range, range2d, shuffle, interleave } from './tools/array'
import { random } from './tools/random'
import { mapRange } from './tools/math'
import { neg } from './tools/math/vectors'
import { chaikinCurve } from './tools/geo/special'
import { draw } from './tools/draw'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const ctx = createCanvas(800, 800)
ctx.background(bg)
setCanvasRange(ctx, -1.1, 1.1)

/* https://generativeartistry.com/tutorials */
function tut01_tiled_lines() {
    const cellSize = 0.1

    // generate grid points
    const pts = range2d([-1, 1], [-1, 1], cellSize, cellSize)

    // create template line (centered at grid point)
    const backSlash = (pt) =>
        new Line([pt[0] - cellSize / 2.0, pt[1] - cellSize / 2.0], [pt[0] + cellSize / 2.0, pt[1] + cellSize / 2.0])

    // copy line to points applying attributes
    const lines = pts.map((pt) => {
        let line = backSlash(pt)
        return Math.random() <= 0.5 ? line : centerRotate(line, Math.PI / 2)
    })

    draw(ctx, lines, { stroke: '#ffffff', lineCap: 'round', weight: 0.01 })
}

/* https://generativeartistry.com/tutorials/joy-division/ */
function tut02_joy_division() {
    // make 2 vertical control lines
    const lineA = new Line([-1, -1], [-1, 1])
    const lineB = new Line([1, -1], [1, 1])
    // turn each line into the same # of points (which will define the number of horizontal lines)
    const numLines = 12
    const ptsA = asPoints(lineA, numLines)
    const ptsB = asPoints(lineB, numLines)
    // zip up the points on both sides into start and end point pairs
    const ptPairs = zip(ptsA, ptsB)
    // connect the point pairs as new lines
    const lines = ptPairs.map(([ptA, ptB]) => new Line(ptA, ptB))
    // convert the new lines into N points we can move around
    const numPoints = 30
    const linePoints = lines.map((line) => asPoints(line, numPoints))
    // randomly move the points (only on the positive Y axis)
    const randomness = 0.12
    const linePointsMoved = linePoints.map((pts) =>
        pts.map((pt) => {
            // (TRICKY BIT)
            // random tappered on ends [-1, 1]

            // TODO: more advanced tapering
            // var distanceToCenter = Math.abs(j - size / 2);
            // var variance = Math.max(size / 2 - 50 - distanceToCenter, 0);
            // var random = Math.random() * variance / 2 * -1;

            const x = Math.abs(pt[0])
            const shaper = mapRange(x, 0, 1, 1, 0)
            return [pt[0], pt[1] - shaper * random(0, randomness)]
        })
    )
    // smooth points using the chaikin curve algo
    const smoothPoints = linePointsMoved.map((pts) => chaikinCurve(pts, 3))
    // convert points into polyline and draw
    const polylines = smoothPoints.map((pts) => new Polyline(pts, { stroke: secondary, weight: 0.01 }))
    draw(ctx, polylines)
}

/* https://generativeartistry.com/tutorials/cubic-disarray/ */
function tut03_cubic_disarray() {
    // create a grid of points
    const tileSize = 0.25
    let pts = range2d([-1, 1], [-1, 1], tileSize, tileSize)

    // add attributes to the points (size, random rotation)
    pts = pts.map((pt, idx) => {
        const pct = mapRange(idx, 0, pts.length, 0, 1)
        const theta = pct * random(-Math.PI / 3, Math.PI / 3)
        return {
            pt,
            size: tileSize,
            theta,
        }
    })

    // create rects from the points and attribute data
    let rects = pts.map(({ pt, size, theta }) =>
        centerRotate(new Rectangle(pt, [size, size], { stroke: primary, fill: secondary, weight: 0.01 }), theta)
    )

    draw(ctx, rects)
}

/* https://generativeartistry.com/tutorials/triangular-mesh/ */
function tut04_triangular_mesh() {}

/* https://generativeartistry.com/tutorials/hypnotic-squares/ */
function tut07_hypnotic_squares() {
    // for each point in a grid
    // (1) create a cell rect
    // (2) find a point inside the cell (center point)
    // (3) create N incresingly smaller rects that lerp their position towards the center point
    // TODO: how do you do for/each in a node system?
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

// tut01_tiled_lines()
tut02_joy_division()
// tut03_cubic_disarray()
// tut07_hypnotic_squares()
