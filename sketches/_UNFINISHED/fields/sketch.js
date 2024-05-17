import { createCanvas, setCanvasRange } from './tools/canvas-utils'
// import { circle } from '@thi.ng/geom'
// import { blobFromCircle } from './libs/geometry/blob'
// import { draw } from '@thi.ng/hiccup-canvas'
// import { iterator, comp, trace, map, range2d } from '@thi.ng/transducers'
// import {} from '@thi.ng/arrays'
// import { add } from '@thi.ng/vectors'
// import noise from './libs/noise/perlin'
//
// // draw(ctx, ['g', { __background: '#333344' }, ...coloredWedges])

const ctx = createCanvas(1200, 1200, 'sketchCanvas')
ctx.background('#333344')
setCanvasRange(ctx, -1.2, 1.2)

console.log(ctx)

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

// function random_unit_vector() {
//     let theta = Math.random() * 2 * Math.PI
//     return { x: Math.cos(theta), y: Math.sin(theta) }
// }

// // console.log(random_unit_vector())
// console.log(noise)

// noise.seed(Math.random());

// for (var x = 0; x < canvas.width; x++) {
//   for (var y = 0; y < canvas.height; y++) {
//     // All noise functions return values in the range of -1 to 1.

//     // noise.simplex2 and noise.perlin2 for 2d noise
//     var value = noise.simplex2(x / 100, y / 100);
//     // ... or noise.simplex3 and noise.perlin3:
//     var value = noise.simplex3(x / 100, y / 100, time);

//     image[x][y].r = Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
//   }
// }
