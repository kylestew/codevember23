import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { shuffle } from './tools/array'
import { pickRandom } from './tools/random'

import { tiled_lines } from './examples/tut01'
import { joy_division } from './examples/tut02'
import { cubic_disarray } from './examples/tut03'
import { triangular_mesh } from './examples/tut04'
import { un_deux_trois } from './examples/tut05'
import { circle_packing } from './examples/tut06'
import { hypnotic_squares } from './examples/tut07'
import { floodFill } from './examples/flood_fill'
import { goto20 } from './examples/goto20'
import { glassImpact } from './examples/glass_impact'
import { distros } from './examples/distros'
import { linesNest } from './examples/lines_nest'
import { weightedRandomDemo } from './examples/weighted-random'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const ctx = createCanvas(1200, 1920)
const { clearCanvas } = setCanvasRange(ctx, -1.02, 1.02)
clearCanvas(bg)

const examples = [
    tiled_lines,
    joy_division,
    cubic_disarray,
    triangular_mesh,
    un_deux_trois,
    circle_packing,
    hypnotic_squares, // 6
    floodFill,
    goto20, // 8
    glassImpact,
    distros, // 10
    weightedRandomDemo,
    linesNest, // 12
]

// TODO: drunken wander example
// const fn = pickRandom(examples)
const fn = examples[12]

document.getElementById('example-title').textContent = fn.name
fn(ctx, palette)

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
