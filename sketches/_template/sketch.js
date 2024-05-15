import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, Polyline, Line, Rectangle } from './tools/geo/shapes'
import {
    centroid,
    asPath,
    asPoints,
    asPolygon,
    edges,
    bounds,
    offset,
    scatter,
    translate,
    resample,
    rotate,
    centerRotate,
} from './tools/geo/ops'
import { Grid, grid, chaikinCurve } from './tools/geo/extended'
import { linspace, full, wrapSides, partition, zip, range, range2d, shuffle, interleave } from './tools/array'
import { random, randomPoint, randomOffset } from './tools/random'
import { mapRange, lerpPt } from './tools/math'
import { neg as vNeg, add as vAdd } from './tools/math/vectors'
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

// TODO: this becomes a transformers lib
function transfomer(transformations, initialData) {
    return transformations.reduce((data, transformFn) => {
        return data.flatMap((item) => {
            const transformed = transformFn(item)
            // Flatten if requested
            if (transformFn.flatten) {
                return transformed
            }
            return [transformed]
        })
    }, initialData)
}

function partial(func, ...fixedArgs) {
    return function (threadedArg) {
        if (Array.isArray(threadedArg)) {
            return threadedArg.map((arg) => func(arg, ...fixedArgs))
        } else {
            return func(threadedArg, ...fixedArgs)
        }
    }
}

function trace() {
    return (input) => {
        console.log(input)
        return input
    }
}

function _offset(...args) {
    return partial(offset, ...args)
}
function _edges(...args) {
    return partial(edges, ...args)
}
function line(...args) {
    return new Line(...args)
}
function _line(...args) {
    return partial(line, ...args)
}
function _zip() {
    return (input) => zip(input[0], input[1])
}
function flatten() {
    const fn = (input) => {
        return input
    }
    fn.flatten = true
    return fn
}
function _debugDraw(ctx) {
    return (input) => {
        draw(ctx, input)
        return input
    }
}

function flags() {
    const rowsCols = 3
    const innerLines = 9
    const output = transfomer(
        [
            // shrink each grid
            _offset(-0.05),
            // split into edges
            _edges(),
            // pick random edge pairs (opposites)
            // TODO: pick random evens odds FN
            (edges) => (Math.random() < 0.5 ? [edges[3], edges[1].reverse()] : [edges[0], edges[2].reverse()]),
            // edges become lines
            _line(),
            // resample lines as points
            partial(asPoints, innerLines),
            // connect points as new set of lines
            _zip(),
            _line({ stroke: primary, weight: 0.01 }),
            // TODO: simplify some of the map operations
            trace(),
            _debugDraw(ctx),
        ],
        grid([-1, -1], [2, 2], rowsCols, rowsCols).rects()
    )

    const rect = new Rectangle([-1, -1], [2, 2])

    // draw(ctx, output, { stroke: primary, weight: 0.01 })

    // // create a grid of flag positions
    // const lines = grid([-1, -1], [2, 2], rowsCols, rowsCols)
    //     .rects()
    //     .map((rect) => {
    //         const inRect = offset(rect, -0.05)

    //         // take each square in grid and decide an orientation
    //         const flip = Math.random() < 0.5
    //         // split into edges based on orientation
    //         const sides = edges(inRect)
    //         const leftEdge = flip ? sides[3] : sides[0]
    //         const rightEdge = flip ? sides[1] : sides[2]
    //         // edges become lines
    //         const line1 = new Line(leftEdge[0], leftEdge[1])
    //         const line2 = new Line(rightEdge[0], rightEdge[1])
    //         // resample lines as points
    //         const pts0 = asPoints(line1, innerLines)
    //         const pts1 = asPoints(line2, innerLines)
    //         // connect points as new set of lines
    //         const lines = zip(pts0, pts1.reverse()).map(([pt0, pt1]) => new Line(pt0, pt1))

    //         // TODO: orig lines get primary
    //         // { stroke: primary, weight: 0.01 })

    //         // add secondary lines overlaid on first in interesting ways
    //         const overLines = lines.map((line, idx) => {
    //             const [a, b] = asPoints(line)
    //             pointLerp
    //             return new Line()
    //             // new lines get secondary
    //         })

    //         return [lines, newLines]
    //     })
    // draw(ctx, lines)
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
