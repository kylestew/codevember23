import { Polygon } from '../tools/geo'
import { gaussian } from '../tools/random'
import { full } from '../tools/array'
import { convexHull } from '../tools/algos/convex-hull'
import { draw } from '../tools/draw'

export function convexHullDemo(ctx, palette) {
    const [bg, primary, secondary] = palette

    // generate a list of points scattered randomly using gaussian distribution around the center
    const pointCount = 36
    const pts = full(pointCount, () => [gaussian(0, 0.4), gaussian(0, 0.4)])

    // find the convex hull of the points
    const hull = convexHull(pts)
    const poly = new Polygon(hull)
    draw(ctx, poly, { stroke: primary, weight: 0.01 })

    draw(ctx, pts, { fill: secondary })
}
