import { Polygon } from '../tools/geo'
import { random, gaussian } from '../tools/random'
import { full, wrapSides } from '../tools/array'
import { convexHull } from '../tools/algos/convex-hull'
import { chaikinCurve } from '../tools/algos/chaikin'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils/animate'

export function convexHullDemo(ctx, palette) {
    const [bg, primary, secondary] = palette

    // generate a list of points scattered randomly using gaussian distribution around the center
    const pointCount = 36
    let pts = full(pointCount, () => [gaussian(0, 0.4), gaussian(0, 0.4)])

    function render(time) {
        ctx.clear(bg)

        // randomly move points
        pts = pts.map(([x, y]) => [x + random(-0.02, 0.02), y + random(-0.02, 0.02)])

        // find the convex hull of the points
        const hull = convexHull(pts)
        const poly = new Polygon(hull)

        // smooth out to make blob
        const blob = new Polygon(chaikinCurve(wrapSides(hull, 1, 0), 6))

        // draw things
        draw(ctx, blob, { fill: secondary + '99' })
        draw(ctx, poly, { stroke: primary + '66', weight: 0.01 })
        draw(ctx, pts, { fill: primary })
    }
    animate(10, render)
}
