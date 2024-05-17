import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { shuffle } from './tools/array'
import { pickRandom } from './tools/random'

import { tiled_lines } from './examples/tut01'
import { joy_division } from './examples/tut02'
import { cubic_disarray } from './examples/tut03'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const ctx = createCanvas(800, 800)
ctx.background(bg)
setCanvasRange(ctx, -1.1, 1.1)

const examples = [tiled_lines, joy_division, cubic_disarray]

examples[1](ctx, palette)
// pickRandom(examples)(ctx, palette)

// /* https://generativeartistry.com/tutorials/triangular-mesh/ */
// function tut04_triangular_mesh() {
//     const grid = new Grid([-1, -1], [2, 2], 8, 8)
//     const polys = grid.rectTriangles()
//     draw(ctx, polys)
// }

// /* https://generativeartistry.com/tutorials/un-deux-trois/ */
// function tut05_un_deux_trois() {
//     const grid = new Grid([-1, -1], [2, 2], 8, 8)
//     const lines = grid.centers().map((pt) => new Line(pt, [0, 0]))
//     draw(ctx, lines)

//     // make a grid of points
//     // find centers of each grid point (make helper)
//     // draw a line through the center of each point with even ends from it at a given rotations
//     // how do draw dual lines?
// }

// /* https://generativeartistry.com/tutorials/hypnotic-squares/ */
// function tut07_hypnotic_squares() {
//     // create a grid
//     const grid = new Grid([-1, -1], [2, 2], 8, 8)
//     // generate a list off offsets for each smallest square
//     const cellSize = grid.cellSize
//     const randomizedOffsets = full(grid.cellCount, () => randomOffset(cellSize[0] / 4.0, cellSize[1] / 4.0))
//     // lerp squares from grid rect towards center point
//     const squareCount = 5
//     const smallSquarePct = 0.45
//     const squares = zip(grid.rects(), randomizedOffsets).map(([rect, randOffset]) =>
//         linspace(0, 1, squareCount).map((pct) => {
//             const size = mapRange(pct, 0, 1, 0, cellSize[0] * smallSquarePct)
//             const trx = lerpPt([0, 0], randOffset, pct)
//             // rect inset by size and translated by lerped offset
//             return translate(offset(rect, -size), trx)
//         })
//     )

//     draw(ctx, squares, { stroke: primary, weight: 0.01 })
// }

// /* https://generativeartistry.com/tutorials/circle-packing/ */
// function tut06_circle_packing() {
//     // TODO: use your algo
// }

// /* https://generativeartistry.com/tutorials/piet-mondrian/ */
// function tut08_piet_mondrain() {
//     // TODO: use your own square splitting algo
// }

// function drawColorWheel() {
//     // circle -> vertices -> partition into pairs -> map to polygons using center point
//     const WEDGE_COUNT = 24
//     const circ = new Circle([0, 0], 1)
//     const pts = asPoints(circ, WEDGE_COUNT)
//     pts.push(pts[0]) // loop back to the start
//     const polys = partition(pts, 2, 1, false).map(
//         (pair, idx) => new Polygon([pair[0], pair[1], [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
//     )

//     draw(ctx, polys)
//     draw(ctx, circ, { stroke: '#ffffff', weight: 0.05 })
// }

// function randomRectsFill() {
//     const boundingRect = new Rectangle([-1, -1], [2, 2], { fill: '#333344' })

//     // clip to bounds
//     ctx.clip(asPath(boundingRect))

//     // 1st layer
//     let pts = scatter(boundingRect, 24)
//     const rects0 = pts.map((pt) => Rectangle.withCenter(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: primary }))

//     // 2nd layer
//     pts = scatter(boundingRect, 24)
//     const rects1 = pts.map((pt) => Rectangle.withCenter(pt, [random(0.8, 2.0), random(0.1, 0.6)], { fill: secondary }))

//     draw(ctx, interleave(rects0, rects1))
// }

// function noiseTest() {}

// // tut01_tiled_lines()
// // tut02_joy_division()
// // tut03_cubic_disarray()
// // tut04_triangular_mesh()
// tut05_un_deux_trois()
// // tut07_hypnotic_squares()

// // drawColorWheel()
// // randomRectsFill()
