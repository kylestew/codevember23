import { range2d, line, copyToPoints } from './nodes/geo'
import { createCanvas } from './nodes/tex'
import { displayData } from './nodes'

import { shuffle } from './tools/array'
const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

// const ctx = createCanvas(800, 800)
// ctx.background(bg)
// setCanvasRange(ctx, -1.1, 1.1)

function ex01_goto_10() {
    const cellSize = 0.25

    let streamGeo = line(null, [0, 0], [cellSize, cellSize])
    console.log(streamGeo)
    let streamPts = range2d(null, [-1, 1], [-1, 1], cellSize, cellSize)
    console.log(streamPts)
    let streamGrid = copyToPoints(streamGeo, streamPts)
    console.log(streamGrid) // TODO: not sure if this is correct, did they copy to the right locations
    let canvasStream = createCanvas(800, 600, bg)
    console.log(canvasStream)

    displayData(canvasStream)

    // renderToCanvas(canvasStream, streamGrid)
    // TODO:
    // - draw lines
    // - rotate, scale lines

    //     // grid pts -> lines
    //     const lines = pts.map((pt) => {
    //         return Math.random() <= 0.5 ? forwardSlash(pt) : backSlash(pt)
    //     })

    //     draw(ctx, lines, { stroke: '#ffffff', lineCap: 'round', weight: 0.01 })
}

// function tut01_tiled_lines_nodes() {
//     const cellSize = 0.5

//     // range2d -> copy to points
//     // random array, ???
//     let data_stream_0 =
//         // let data_stream_0
//         _range2d({ pts: [], geo: [] }, [-1, 1], [-1, 1], cellSize, cellSize)
//     console.log(data_stream_0)

//     // let data_stream_1 = _line(data_stream_0, [0, 0], [cellSize, cellSize])
//     // console.log(data_stream_1)

//     // data = _copyToPoints(data, data.pts)

//     // const forwardSlash = (pt) => new Line([pt[0], pt[1]], [pt[0] + cellSize, pt[1] + cellSize])
//     // const backSlash = (pt) => new Line([pt[0], pt[1] + cellSize], [pt[0] + cellSize, pt[1]])

//     // // grid pts -> lines
//     // const lines = pts.map((pt) => {
//     //     return Math.random() <= 0.5 ? forwardSlash(pt) : backSlash(pt)
//     // })

//     // draw(ctx, lines, { stroke: '#ffffff', lineCap: 'round', weight: 0.01 })
// }

// /* https://generativeartistry.com/tutorials/joy-division/ */
// function tut02_joy_division() {
//     // make a list of horizontal lines
//     // convert to points
//     // randomly distrub those points
//     // shaope the distrubed points to apply mostly in the middle
//     // chaickin curve the points
//     // convert to polyline and draw
// }

// /* https://generativeartistry.com/tutorials/cubic-disarray/ */
// function tut03_cubic_disarray() {
//     const rect = new Rectangle([-0.5, -0.5], [1, 1], { fill: primary })

//     // create a grid of rectangles
//     const tileSize = 0.25
//     let rects = range2d([-1, 1], [-1, 1], tileSize, tileSize).map(
//         (pt) => new Rectangle(pt, [tileSize, tileSize], { stroke: primary, fill: secondary, weight: 0.01 })
//     )
//     // distort the rectangles more and more based on index
//     rects = rects.map((rect, idx) => {
//         const pct = idx / rects.length
//         const theta = pct * random(-Math.PI / 3, Math.PI / 3)
//         return centerRotate(rect, theta)
//     })

//     draw(ctx, rects)
// }

// /* https://generativeartistry.com/tutorials/triangular-mesh/ */
// function tut04_triangular_mesh() {}

// function drawColorWheel() {
//     // circle -> vertices -> partition into pairs -> map to polygons using center point
//     const WEDGE_COUNT = 24
//     const circ = new Circle([0, 0], 1)
//     const verts = vertices(circ, WEDGE_COUNT)
//     verts.push(verts[0]) // loop back to the start
//     const polys = partition(verts, 2, 1, false).map(
//         (pair, idx) => new Polygon([pair[0], pair[1], [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
//     )

//     draw(ctx, polys)
//     draw(ctx, circ, { stroke: '#ffffff', weight: 0.05 })
// }

// function randomRectsFill() {
//     const boundingRect = new Rectangle([-1, -1], [2, 2], { fill: '#333344' })
//     // draw(ctx, boundingRect, { stroke: '#8899ee', weight: 0.01 })

//     // clip to bounds
//     ctx.clip(asPath(boundingRect))

//     // 1st layer
//     let pts = scatter(boundingRect, 24)
//     const rects0 = pts.map((pt) =>
//         Rectangle.fromCenterPoint(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: primary })
//     )

//     // 2nd layer
//     pts = scatter(boundingRect, 24)
//     const rects1 = pts.map((pt) =>
//         Rectangle.fromCenterPoint(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: secondary })
//     )

//     draw(ctx, interleave(rects0, rects1))
// }

ex01_goto_10()
