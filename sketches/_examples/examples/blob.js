import { Rectangle, Polygon, Polyline } from '../tools/geo'
import { asPoints } from '../tools/geo'
import { randomOffset } from '../tools/random'
import { full, zip } from '../tools/array'
import { add } from '../tools/math/vectors'
import { chaikinCurve } from '../tools/algos/chaikin'
import { draw } from '../tools/draw'

export function blobApproaches(ctx, palette) {
    const [bg, primary, secondary] = palette

    const rect = new Rectangle([-0.5, -0.5], [1, 1])
    const randRect = new Polygon(asPoints(rect).map((pt) => add(pt, randomOffset(-0.1, 0.1))))
    const smoothedRandRect = new Polygon(chaikinCurve(asPoints(randRect), 4, true))

    draw(ctx, asPoints(randRect))
    draw(ctx, smoothedRandRect)
}

/*
function blobFromCircle(circ: Circle, randRadius: number): Path2D {
    // circle -> bounding rect -> edges -> control points
    let pts = [
        ...iterator(
            comp(
                // disturb edge points a bit
                map((pts) => [scatter(circle(pts[0], randRadius), 1)![0], scatter(circle(pts[1], randRadius), 1)![0]]),
                // map((pts) => pts),
                // turn into lines
                map((pts) => line(pts[0], pts[1])),
                // find modpoint of line (becomes new control point)
                map((line) => [pointAt(line, 0.22), pointAt(line, 0.5), pointAt(line, 0.77)]),
                // just the points
                flatten1()
                // trace() //
            ),
            // edges of bounding rect of circle
            edges(bounds(circ))
        ),
    ]

    // first point is last control point, rotate left
    pts = rotate(pts, -1)
    // move to that control point
    const firstPt = pts[0]!
    // now rotate to be last point in array
    pts = rotate(pts, -1)

    // convert points to Path2D
    let path = new Path2D()
    path.moveTo(firstPt[0], firstPt[1])

    const groupedPoints = [...iterator(partition(3), pts)]
    groupedPoints.forEach((pts) => {
        const [p1, p2, p3] = pts
        path.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1])
    })
    path.closePath()
    return path
}
*/
