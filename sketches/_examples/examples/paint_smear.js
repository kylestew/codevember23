import { Circle, Quadratic } from '../tools/geo'
import { pointAt, tangentAt, translate, scale, rotate, centerRotate, asPolygon } from '../tools/geo/ops'
import { mapRange } from '../tools/math'
import { range, linspace } from '../tools/array'
import { random } from '../tools/random'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils'

export function paintSmear(ctx, palette) {
    const [bg, primary, secondary] = palette

    // (1) create a brush head (base line of polys)
    const brushHead = [
        asPolygon(new Circle([0, -0.075], 0.1), 6), //
        asPolygon(new Circle([0, 0], 0.1), 9),
        asPolygon(new Circle([0, 0.075], 0.1), 4),
    ]
    // draw(ctx, brushHead)

    // (2) create a path to follow
    const path = new Quadratic([
        [-0.5, 0.5],
        [-0.2, -0.2],
        [0.5, -0.5],
    ])
    // draw(ctx, path)

    // (3) for 't' steps, copy the brush head set of polys along path
    linspace(0, 1.0, 128).forEach((t) => {
        const trx = pointAt(path, t)
        const sxy = mapRange(t, 0, 1, 1.0, 0.2)

        const [tanX, tanY] = tangentAt(path, t)
        const angle = Math.atan2(tanY, tanX)

        // (3a) slightly shrink poly
        // (3b) slightly rotate poly
        const curSet = brushHead.map((poly) =>
            scale(translate(rotate(centerRotate(poly, random(-1, 1)), angle), trx), sxy)
        )
        draw(ctx, curSet, { fill: primary })
    })
}
