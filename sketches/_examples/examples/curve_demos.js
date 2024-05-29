import { Circle, Line, Quadratic } from '../tools/geo'
import { pointAt, translate, scale } from '../tools/geo/ops'
import { range, linspace } from '../tools/array'
import { easeInQuad, easeOutInCubic } from '../tools/math/easings'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils'

export function curveDemos(ctx, palette) {
    const [bg, primary, secondary] = palette

    function render(timestep) {
        const tick = timestep * 0.0002
        ctx.clear(bg)

        let pts = [
            [-1, -1],
            [0.8 * Math.sin(1.2 * tick), 0.8 * Math.cos(tick)],
            [1, 1],
        ]
        const curve0 = new Quadratic(pts)
        draw(ctx, [curve0, pts], { stroke: primary, weight: 0.02 })

        pts = linspace(0, 1, 42).map((t) => pointAt(curve0, easeOutInCubic(t)))
        draw(ctx, pts, { fill: bg, weight: 0.005 })

        pts = [
            [-1, 1],
            [0.8 * Math.cos(0.8 * tick), 0.8 * Math.sin(1.2 * tick)],
            [1, -1],
        ]
        const curve1 = new Quadratic(pts)
        draw(ctx, [curve1, pts], { stroke: secondary, weight: 0.02 })

        pts = linspace(0, 1, 42).map((t) => pointAt(curve1, easeInQuad(t)))
        draw(ctx, pts, { fill: bg, weight: 0.005 })
    }
    animate(20, render)
}
