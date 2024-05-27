import { Line } from '../tools/geo'
import { random, randomPoint } from '../tools/random'
import { simplex2 } from '../tools/random/noise'
import { full } from '../tools/array'
import { nearPt } from '../tools/geo/extended/near-point'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils/animate'

export function nearPointDemo(ctx, palette) {
    const [bg, primary, secondary] = palette
    ctx.setRange(-1, 1)

    // generate a list of points scattered randomly
    const pointCount = 64
    let pts = full(pointCount, () => randomPoint([-1, -1], [1, 1]))

    function render(time) {
        ctx.clear(bg)

        // wander points
        // pts = pts.map(([x, y]) => [x + random(-0.01, 0.01), y + random(-0.01, 0.01)])
        pts = pts.map(([x, y]) => {
            const td = time * 0.001
            const dx = 0.01 * simplex2(x + td, y + td)
            const dy = 0.01 * simplex2(x + td, y - td)

            // wrap bounds of screen [-1, 1]
            let newX = x + dx
            let newY = y + dy
            if (newX > 1) newX -= 2
            if (newX < -1) newX += 2
            if (newY > 1) newY -= 2
            if (newY < -1) newY += 2

            return [newX, newY]
        })

        // draw all points
        draw(ctx, pts, { fill: secondary })

        const targetPoint = [0, 0]
        const N = 9
        const connectedPts = nearPt(targetPoint, pts, N)

        // draw lines from target point to connected point
        const lines = connectedPts.map((pt) => new Line(targetPoint, pt))
        draw(ctx, lines, { stroke: primary, weight: 0.01 })
    }
    animate(10, render)
}
