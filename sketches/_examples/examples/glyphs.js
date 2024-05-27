// import { Polygon } from '../tools/geo'
// import { random, gaussian } from '../tools/random'
// import { simplex2 } from '../tools/random/noise'
// import { full } from '../tools/array'
// import { convexHull } from '../tools/algos/convex-hull'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils/animate'

export function glyphs(ctx, palette) {
    const [bg, primary, secondary] = palette

    // // generate a list of points scattered randomly using gaussian distribution around the center
    // const pointCount = 36
    // let pts = full(pointCount, () => [gaussian(0, 0.4), gaussian(0, 0.4)])

    // function render(time) {
    //     ctx.clear(bg)

    //     pts = pts.map(([x, y]) => [x + random(-0.02, 0.02), y + random(-0.02, 0.02)])

    //     // find the convex hull of the points
    //     const hull = convexHull(pts)
    //     const poly = new Polygon(hull)
    //     draw(ctx, poly, { stroke: primary, weight: 0.01 })

    //     draw(ctx, pts, { fill: secondary })
    // }
    // animate(10, render)
}
