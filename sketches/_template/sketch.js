import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, Polyline, Line, line, Rectangle, rectangle } from './tools/geo/shapes'
import {
    centroid,
    asPath,
    asPoints,
    asPolygon,
    edges,
    bounds,
    offset,
    splitAt,
    scatter,
    translate,
    resample,
    rotate,
    centerRotate,
} from './tools/geo/ops'
import { Grid, grid, chaikinCurve } from './tools/geo/extended'
import { linspace, full, wrapSides, partition, zip, range, range2d, shuffle, interleave } from './tools/array'
import { random, randomPoint, randomOffset, pickRandom } from './tools/random'
import { mapRange, lerpPt } from './tools/math'
import { neg as vNeg, add as vAdd } from './tools/math/vectors'
import { draw } from './tools/draw'
import { transformer, partial, trace } from './tools/trx'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const ctx = createCanvas(800, 800)
ctx.background(bg)
setCanvasRange(ctx, -1.0, 1.0)

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
    const lineA = new Line([-1, -0.8], [-1, 1])
    const lineB = new Line([1, -0.8], [1, 1])
    // turn each line into the same # of points (which will define the number of horizontal lines)
    const numLines = 24
    const ptsA = asPoints(lineA, numLines)
    const ptsB = asPoints(lineB, numLines)
    // zip up the points on both sides into start and end point pairs
    const ptPairs = zip(ptsA, ptsB)
    // connect the point pairs as new lines
    const lines = ptPairs.map(([ptA, ptB]) => new Line(ptA, ptB))
    // convert the new lines into N points we can move around
    const numPoints = 36
    const linePoints = lines.map((line) => asPoints(line, numPoints))
    // randomly move the points (only on the positive Y axis)
    const randomnessBig = 0.4
    const randomnessSmall = 0.01
    const linePointsMoved = linePoints.map((pts) =>
        pts.map((pt) => {
            // (TRICKY BIT)
            // TODO: learn how these work
            // gaussian shaping function
            const x = pt[0]
            const gaussShape = Math.exp(-8 * x * x)

            return [pt[0], pt[1] - gaussShape * random(0, randomnessBig) + random(0, randomnessSmall)]
        })
    )
    // resample and do again at a smaller randomness scale
    //...
    // TODO: be able to resample polylines

    // smooth points using the chaikin curve algo
    const smoothPoints = linePointsMoved.map((pts) => chaikinCurve(pts, 3))
    // convert points into polyline and draw
    // const polylines = linePointsMoved.map((pts) => new Polyline(pts, { stroke: secondary, weight: 0.01 }))
    const polylines = smoothPoints.map((pts) => new Polyline(pts, { stroke: secondary, weight: 0.01 }))
    const polys = polylines.map((polyline) => new Polygon(polyline.pts, { fill: bg }))
    draw(ctx, interleave(polys, polylines))
}

/* https://generativeartistry.com/tutorials/cubic-disarray/ */
function tut03_cubic_disarray() {
    // create a grid of rectangles
    const columnCount = 8
    let grid = new Grid([-1, -1], [2, 2], columnCount, columnCount)

    // rotate and translate randomly scaled by index
    const rects = grid.rects().map((rect, idx) => {
        const pct = mapRange(idx, 0, columnCount * columnCount, 0, 1)
        const theta = pct * random(-Math.PI / 6, Math.PI / 6)
        const sz = grid.cellSize
        const tx = [pct * sz[0] * random(0.0, 0.5), pct * sz[1] * random(0.0, 0.2)]
        return translate(centerRotate(rect, theta), tx)
    })

    draw(ctx, rects, { fill: primary, stroke: secondary, weight: 0.01 })
}

/* https://generativeartistry.com/tutorials/triangular-mesh/ */
function tut04_triangular_mesh() {}

/* https://generativeartistry.com/tutorials/un-deux-trois/ */
function tut05_un_deux_trois() {
    // make a grid of points
    // find centers of each grid point (make helper)
    // draw a line through the center of each point with even ends from it at a given rotations
    // how do draw dual lines?
}

/* https://generativeartistry.com/tutorials/hypnotic-squares/ */
function tut07_hypnotic_squares() {
    // create a grid
    const grid = new Grid([-1, -1], [2, 2], 8, 8)
    // generate a list off offsets for each smallest square
    const cellSize = grid.cellSize
    const randomizedOffsets = full(grid.cellCount, () => randomOffset(cellSize[0] / 4.0, cellSize[1] / 4.0))
    // lerp squares from grid rect towards center point
    const squareCount = 5
    const smallSquarePct = 0.45
    const squares = zip(grid.rects(), randomizedOffsets).map(([rect, randOffset]) =>
        linspace(0, 1, squareCount).map((pct) => {
            const size = mapRange(pct, 0, 1, 0, cellSize[0] * smallSquarePct)
            const trx = lerpPt([0, 0], randOffset, pct)
            // rect inset by size and translated by lerped offset
            return translate(offset(rect, -size), trx)
        })
    )

    draw(ctx, squares, { stroke: primary, weight: 0.01 })
}

function drawColorWheel() {
    // circle -> vertices -> partition into pairs -> map to polygons using center point
    const WEDGE_COUNT = 24
    const circ = new Circle([0, 0], 1)
    const pts = asPoints(circ, WEDGE_COUNT)
    pts.push(pts[0]) // loop back to the start
    const polys = partition(pts, 2, 1, false).map(
        (pair, idx) => new Polygon([pair[0], pair[1], [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
    )

    draw(ctx, polys)
    draw(ctx, circ, { stroke: '#ffffff', weight: 0.05 })
}

function randomRectsFill() {
    const boundingRect = new Rectangle([-1, -1], [2, 2], { fill: '#333344' })

    // clip to bounds
    ctx.clip(asPath(boundingRect))

    // 1st layer
    let pts = scatter(boundingRect, 24)
    const rects0 = pts.map((pt) => Rectangle.withCenter(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: primary }))

    // 2nd layer
    pts = scatter(boundingRect, 24)
    const rects1 = pts.map((pt) => Rectangle.withCenter(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: secondary }))

    draw(ctx, interleave(rects0, rects1))
}

function flags() {
    const inset = -0.01
    const rowsCols = 12
    const innerLines = 16
    const lineWeight = 0.015

    // create a grid of flag positions
    const lines = grid([-1, -1], [2, 2], rowsCols, rowsCols)
        .rects()
        .map((rect) => {
            // inset each rect to give padding between
            const inRect = offset(rect, inset)
            // split into edges based on orientation
            const sides = edges(inRect)
            // take each square in grid and decide an orientation
            const flip = Math.random() < 0.5
            const selectedEdges = [flip ? sides[0].reverse() : sides[1].reverse(), flip ? sides[2] : sides[3]]
            // ALT: pick 2 distinct random edges
            // const selectedEdges = pickRandom(sides, 2)
            // edges become lines
            const edgeLines = selectedEdges.map((edge) => line(edge))
            // resample lines as points
            const pts = edgeLines.map((line) => asPoints(line, innerLines))
            // zip points into pairs (1 at a time)
            // const zippedPointPairs = pts.map((pt_pair) => zip(pt_pair[0], pt_pair[1]))
            const zippedPointPairs = zip(pts[0], pts[1])
            // join pairs into lines
            const lines = zippedPointPairs.map((pt_pair) => line(pt_pair))

            // EXP: draw lines over lines
            // or line in lines, split PCT and overlay another line

            const flipOneOrTwo = Math.random() < 0.5
            const overLines = lines.map((line, idx) => {
                const flip = Math.random() < 0.5
                let pct = idx / innerLines
                if (flip) {
                    pct = 1.0 - pct
                }
                // return splitAt(line, pct)[Math.random() < 0.5 ? 0 : 1]
                return splitAt(line, pct)[1]
            })

            ctx.lineCap = 'round'
            // TODO: draw interleaved
            draw(ctx, lines, { stroke: primary + '44', weight: lineWeight })
            draw(ctx, overLines, { stroke: secondary + '22', weight: lineWeight })
            // draw(ctx, lines, { stroke: primary + '22', weight: lineWeight })
            // draw(ctx, overLines, { stroke: secondary + '22', weight: lineWeight })
        })
}

// tut01_tiled_lines()
// tut02_joy_division()
// tut03_cubic_disarray()
// tut04_triangular_mesh()
// tut05_un_deux_trois()
// tut07_hypnotic_squares()

// drawColorWheel()
// randomRectsFill()
flags()
