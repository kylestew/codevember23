import { Circle, Line, Ray } from '../tools/geo/shapes'
import { pointAt, offset, intersects } from '../tools/geo/ops'
import { random, gaussian } from '../tools/random'
import { simplex3 } from '../tools/random/noise'
import { full, range, rangeFn } from '../tools/array'
import { mapRange } from '../tools/math'
import { draw } from '../tools/draw'
import { simpleMouseInput } from '../simple-input'

function raysFromCircle(circle, rayCount, distance = 10.0) {
    const outerCirc = offset(circle, distance)

    // different ways to decide ray angle (t of circle point)
    const ts = full(rayCount, () => Math.random())
    // const ts = full(rayCount, () => gaussian(0.5, 0.3))
    // const ts = rangeFn(0.0, 1.0, () => Math.abs(gaussian(0.0, 0.0001)))
    // const ts = range(0.0, 3.333 * Math.random(), 0.002).map((t) => simplex3(2.45, 1.23, t))

    // use the circle to create a bunch of rays outwards from the center
    // create the ray by connecting a point on the circle and a point
    // on another circle with the same center and a much larger radius
    return ts.map((t) => new Line([pointAt(circle, t), pointAt(outerCirc, t)]))
}

export function raytraceIdea(ctx, palette) {
    const [bg, primary, secondary] = palette

    // const circ = new Circle([0, 0], 0.1)
    // const rays = raysFromCircle(circ, 1000)

    const ray = new Ray([-0.5, -0.5], [0.5, 0.5])
    draw(ctx, ray, { stroke: primary, weight: 0.01 })

    // const line = Line.withCenter([0, 0], Math.PI / -4.0, 1.0)
    const line = Line.withCenter([0, 0], Math.PI / -8.0, 1.0)
    draw(ctx, line, { stroke: secondary, weight: 0.01 })

    console.log(intersects(ray, line))

    // TODO: find the intersection
    // draw(ctx, circ)
    // draw(ctx, rays, { stroke: primary, weight: 0.001 })

    /*
    function render(mousePt, mouseDown) {
        ctx.clear(bg)

        const ptCount = 9000

        const circleA = new Circle([0, 0], 0.005)
        const raysA = raysFromCircle(circleA, ptCount)
        draw(ctx, raysA, { stroke: primary + '99', weight: 0.0001 })

        // map mouse to canvas bounds
        const canvasX = mapRange(mousePt[0], 0, 1, -1.1, 1.1)
        const canvasY = mapRange(mousePt[1], 0, 1, 1.1, -1.1)
        const circleB = new Circle([canvasX, canvasY], 0.005)
        const raysB = raysFromCircle(circleB, ptCount)
        draw(ctx, raysB, { stroke: secondary + '99', weight: 0.0001 })

        draw(ctx, circleA, { fill: primary })
        if (mouseDown) {
            draw(ctx, circleB, { fill: 'white' })
        } else {
            draw(ctx, circleB, { fill: secondary })
        }
    }

    simpleMouseInput(ctx.canvas, (pt, mouseDown) => {
        render(pt, mouseDown)
    })
    */
}
