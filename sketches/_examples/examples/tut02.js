import { Line } from '../tools/geo'

/* https://generativeartistry.com/tutorials/joy-division/ */
export function joy_division(ctx, palette) {
    // make 2 vertical control lines
    const lineA = new Line([-1, -0.8], [-1, 1])
    const lineB = new Line([1, -0.8], [1, 1])

    console.log(lineA, lineB)

    //     // turn each line into the same # of points (which will define the number of horizontal lines)
    //     const numLines = 24
    //     const ptsA = asPoints(lineA, numLines)
    //     const ptsB = asPoints(lineB, numLines)
    //     // zip up the points on both sides into start and end point pairs
    //     const ptPairs = zip(ptsA, ptsB)
    //     // connect the point pairs as new lines
    //     const lines = ptPairs.map(([ptA, ptB]) => new Line(ptA, ptB))
    //     // convert the new lines into N points we can move around
    //     const numPoints = 36
    //     const linePoints = lines.map((line) => asPoints(line, numPoints))
    //     // randomly move the points (only on the positive Y axis)
    //     const randomnessBig = 0.4
    //     const randomnessSmall = 0.01
    //     const linePointsMoved = linePoints.map((pts) =>
    //         pts.map((pt) => {
    //             // (TRICKY BIT)
    //             // TODO: learn how these work
    //             // gaussian shaping function
    //             const x = pt[0]
    //             const gaussShape = Math.exp(-8 * x * x)
    //             return [pt[0], pt[1] - gaussShape * random(0, randomnessBig) + random(0, randomnessSmall)]
    //         })
    //     )
    //     // resample and do again at a smaller randomness scale
    //     //...
    //     // TODO: be able to resample polylines
    //     // smooth points using the chaikin curve algo
    //     const smoothPoints = linePointsMoved.map((pts) => chaikinCurve(pts, 3))
    //     // convert points into polyline and draw
    //     // const polylines = linePointsMoved.map((pts) => new Polyline(pts, { stroke: secondary, weight: 0.01 }))
    //     const polylines = smoothPoints.map((pts) => new Polyline(pts, { stroke: secondary, weight: 0.01 }))
    //     const polys = polylines.map((polyline) => new Polygon(polyline.pts, { fill: bg }))
    //     draw(ctx, interleave(polys, polylines))
}
