import { Line, Polyline, Polygon } from '../tools/geo'
import { asPoints } from '../tools/geo/ops'
import { zip, interleave } from '../tools/array'
import { random } from '../tools/random'
import { draw } from '../tools/draw'
import { chaikinCurve } from '../tools/geo/extended/chaikin'

/* https://generativeartistry.com/tutorials/joy-division/ */
export function joy_division(ctx, palette) {
    const [bg, primary, secondary] = palette

    // make 2 vertical control lines
    const lineA = new Line([-1, -0.8], [-1, 1])
    const lineB = new Line([1, -0.8], [1, 1])

    // turn each line into endpoints for horizontal lines
    const numLines = 36
    const ptsA = asPoints(lineA, numLines)
    const ptsB = asPoints(lineB, numLines)

    // zip up the points into lines
    const lines = zip(ptsA, ptsB).map(([ptA, ptB]) => new Line(ptA, ptB))

    // convert the new lines into N points we can move around
    const numPoints = 36
    const linePoints = lines.map((line) => asPoints(line, numPoints))

    // randomly move the points (only on the positive Y axis)
    const randomnessBig = 0.4
    const randomnessSmall = 0.005
    let linePointsMoved = linePoints.map((pts) =>
        pts.map((pt) => {
            // (TRICKY BIT)
            // TODO: learn how these work
            // gaussian shaping function
            const x = pt[0]
            const gaussShape = Math.exp(-8 * x * x)
            return [pt[0], pt[1] - gaussShape * random(0, randomnessBig)]
        })
    )

    // smooth out curve one iteration
    let smoothPoints = linePointsMoved.map((pts) => chaikinCurve(pts, 2))

    // second pass of random displacement, smaller values
    linePointsMoved = smoothPoints.map((pts) =>
        pts.map((pt) => {
            // (TRICKY BIT)
            // TODO: learn how these work
            // gaussian shaping function
            // only apply on the outsides
            const x = pt[0]
            const gaussShape = 1.0 - Math.exp(-8 * x * x)
            return [pt[0], pt[1] + random(-randomnessSmall, gaussShape * randomnessSmall)]
        })
    )

    // finish smoothing things out
    smoothPoints = linePointsMoved.map((pts) => chaikinCurve(pts, 2))

    // convert to polylines
    const polylines = smoothPoints.map((pts) => new Polyline(pts, { stroke: secondary, weight: 0.005 }))

    const polys = polylines.map((polyline) => new Polygon(polyline.pts, { fill: bg }))
    draw(ctx, interleave(polys, polylines))
}
