import { random, gaussian } from '../tools/random'
import { full, zip } from '../tools/array'
import { draw } from '../tools/draw'

export function convexHull(ctx, palette) {
    const [bg, primary, secondary] = palette

    // generate a list of points scattered randomly using gaussian distribution around the center
    const pointCount = 24
    const pts = full(pointCount, () => [gaussian(0, 0.35), gaussian(0, 0.35)])

    draw(ctx, pts)

    // find the convex hull

    // further connect the inner points to the convex hull

    // requestAnimationFrame(() => convexHull(ctx, palette))

    // scatter 3 points
    // point defines center of distribution
    // scatter shapes/points/colors around the distribution
}
