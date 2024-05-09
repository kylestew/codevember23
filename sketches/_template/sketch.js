import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, asPath } from './tools/geo'

const WEDGE_COUNT = 24
const circ = new Circle([0, 0], 1)
const verts = vertices(circ, WEDGE_COUNT + 1)

console.log(verts)

const ctx = createCanvas(800, 600)
ctx.background('#333344')
setCanvasRange(ctx, -1.1, 1.1)

ctx.fillStyle = '#ee669911'
ctx.fill(asPath(circ))

/*
import { circle, polygon, vertices } from '@thi.ng/geom'
import { iterator, comp, trace, mapIndexed, partition } from '@thi.ng/transducers'
import { draw } from '@thi.ng/hiccup-canvas'

// define polygon wedges
const coloredWedges = iterator(
    comp(
        // partition pairs of points
        partition(2, 1, true),
        // trace(),
        // convert to polygons and color them
        mapIndexed((idx, pt_pair) => {
            const pt0 = pt_pair[0]
            const pt1 = pt_pair[1] ?? [1, 0]
            return polygon([pt0, pt1, [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
        })
    ),
    // vertices around a circle
    vertices(circle([0, 0], 1), WEDGE_COUNT + 1)
)
*/

// import { iterator, comp, trace, map, range2d } from '@thi.ng/transducers'
// import { blobFromCircle } from './libs/geometry/blob'
// for (let i = 0; i < 12; i++) {
//     const blobs = iterator(
//         comp(
//             // create circle at grid point
//             map((pt) => circle(add([], pt, [0.25, 0.25]), 0.2)),
//             // convert to blob
//             map((circ) => blobFromCircle(circ, i / 30.0)),
//             trace() //
//         ),
//         // layout grid
//         range2d(-1.0, 1.0, -1.0, 1.0, 0.5, 0.5)
//     )

//     // draw blobs
//     ctx.fillStyle = '#ee669911'
//     ctx.strokeStyle = '#ffffff98'
//     for (const blob of blobs) {
//         ctx.fill(blob)
//         ctx.lineWidth = 0.006
//         ctx.stroke(blob)
//     }
// }
