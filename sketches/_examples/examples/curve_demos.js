import { Line, Quadratic } from '../tools/geo'
import { pointAt, tangentAt, normalAt } from '../tools/geo/ops'
import { range, linspace } from '../tools/array'
import { easeInQuad, easeOutInCubic } from '../tools/math/easings'
import { add } from '../tools/math/vectors'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils'

// hack for now
import { Bezier } from 'bezier-js'

export function curveDemos(ctx, palette) {
    const [bg, primary, secondary] = palette

    function render(timestep) {
        const tick = timestep * 0.0004
        ctx.clear(bg)

        let pts = [
            [-0.75, -0.75],
            [0.5 * Math.sin(1.2 * tick), 0.5 * Math.cos(tick)],
            [0.75, 0.75],
        ]
        const curve0 = new Quadratic(pts)

        let tangents = linspace(0, 1.0, 16).map((t) => {
            const a = pointAt(curve0, t)
            const b = tangentAt(curve0, t)
            return new Line(a, add(a, b))
        })
        draw(ctx, tangents, { stroke: 'black', weight: 0.005 })
        draw(ctx, [curve0, pts], { stroke: primary, weight: 0.02 })

        pts = [
            [-0.75, 0.75],
            [0.5 * Math.cos(0.8 * tick), 0.5 * Math.sin(1.2 * tick)],
            [0.75, -0.75],
        ]
        const curve1 = new Quadratic(pts)
        draw(ctx, [curve1, pts], { stroke: secondary, weight: 0.02 })

        let normals = linspace(0, 1.0, 16).map((t) => {
            const pct = easeInQuad(t)
            const a = pointAt(curve1, pct)
            const b = normalAt(curve1, pct)
            return new Line(a, add(a, b))
        })
        draw(ctx, normals, { stroke: 'black', weight: 0.005 })
    }
    animate(20, render)
}
