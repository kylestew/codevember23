import { Line } from '../../tools/geo'
import { random, gaussian } from '../../tools/random'
import { full, zip } from '../../tools/array'
import { nearPt } from '../../tools/geo/extended/near-point'
import { draw } from '../../tools/draw'

export function nearPointDemo(ctx, palette) {
    const [bg, primary, secondary] = palette

    // generate a list of points scattered randomly using gaussian distribution around the center
    const pointCount = 42
    const pts = full(pointCount, () => [random(-1, 1), random(-1, 1)])
    // const pts = full(pointCount, () => [gaussian(0, 0.5), gaussian(0, 0.5)])

    const targetPoint = [0, 0]
    const N = 9
    const connectedPts = nearPt(targetPoint, pts, N)

    // draw all points
    draw(ctx, pts)

    // draw lines from target point to connected point
    const lines = connectedPts.map((pt) => new Line(targetPoint, pt))
    draw(ctx, lines, { stroke: 'red', weight: 0.01 })
}
