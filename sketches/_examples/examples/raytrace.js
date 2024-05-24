import { Circle, Line, Ray } from '../tools/geo/shapes'
import { pointAt, offset } from '../tools/geo/ops'
import { random, gaussian } from '../tools/random'
import { simplex3 } from '../tools/random/noise'
import { full, range, rangeFn } from '../tools/array'
import { draw } from '../tools/draw'

function raysFromCircle(circle, rayCount, distance = 2.0) {
    const outerCirc = offset(circle, distance)

    // different ways to decide ray angle (t of circle point)
    const ts = full(rayCount, () => Math.random())
    // const ts = full(count, () => gaussian(0.5, 0.2))
    // const ts = rangeFn(0.0, 1.0, () => Math.abs(gaussian(0.0, 0.01)))
    // const ts = range(0.0, 2.0, 0.001).map((t) => simplex3(2.45, 1.23, t))

    return ts.map((t) => new Line([pointAt(circle, t), pointAt(outerCirc, t)]))
}

export function raytraceIdea(ctx, palette) {
    const [bg, primary, secondary] = palette

    // use the circle to create a bunch of rays outwards from the center
    // create the ray by connecting a point on the circle and a point
    // on another circle with the same center and a much larger radius
    // const circ = new Circle([0, 0], 0.1)
    // const rays = raysFromCircle(circ, 1000)

    const ray = new Ray([-0.5, -0.5], [0.5, 0.5])
    draw(ctx, ray, { stroke: primary, weight: 0.01 })

    const line = Line.withCenter([0, 0], Math.PI / -4.0, 1.0)
    draw(ctx, line, { stroke: secondary, weight: 0.01 })

    TODO: find the intersection
    // draw(ctx, circ)
    // draw(ctx, rays, { stroke: primary, weight: 0.001 })
}
