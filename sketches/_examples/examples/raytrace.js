import { Circle, Line } from '../tools/geo/shapes'
import { pointAt, offset } from '../tools/geo/ops'
import { full } from '../tools/array'
import { draw } from '../tools/draw'

export function raytraceIdea(ctx, palette) {
    const [bg, primary, secondary] = palette

    const circ = new Circle([0, 0], 0.1)

    // use the circle to create a bunch of rays outwards from the center
    // create the ray by connecting a point on the circle and a point
    // on another circle with the same center and a much larger radius
    const count = 20000
    const outerCirc = offset(circ, 2.0)
    const rays = full(count, () => Math.random()).map((t) => new Line([pointAt(circ, t), pointAt(outerCirc, t)]))

    // draw(ctx, circ)
    draw(ctx, rays, { stroke: primary + '33', weight: 0.0005 })
}
