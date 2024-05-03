// import { createCanvas, setCanvasRange } from 'canvas-utils'
// import { circle } from '@thi.ng/geom'
// import { blobFromCircle } from './libs/geometry/blob'
// import { draw } from '@thi.ng/hiccup-canvas'
// import { iterator, comp, trace, map, range2d } from '@thi.ng/transducers'
// import {} from '@thi.ng/arrays'
// import { add } from '@thi.ng/vectors'

// // draw(ctx, ['g', { __background: '#333344' }, ...coloredWedges])

// const ctx = createCanvas(1200, 1200, 'sketchCanvas')
// ctx.background('#333344')
// setCanvasRange(ctx, -1.2, 1.2)

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

import { Brush, BrushInfo } from 'brushing'
// import { BrushInfo } from 'brushing/types'

// new Brush(BrushInfo)

const info: BrushInfo = {
    type: 'debug',
    size: 1.0,
    vibration: 0,

    definition: undefined,
    quality: undefined,

    // opacity: 0,
    // spacing: 0,
    // pressure: {
    //     curve: [],
    //     min_max: []
    // }
}

console.log(Brush)
