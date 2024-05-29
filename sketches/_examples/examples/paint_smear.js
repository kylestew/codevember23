import { Circle, Line, Quadratic } from '../tools/geo'
import { pointAt, translate, scale } from '../tools/geo/ops'
import { mapRange } from '../tools/math'
import { range, linspace } from '../tools/array'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils'

export function paintSmear(ctx, palette) {
    const [bg, primary, secondary] = palette

    // curve from points
    let pts = [
        [-1, -1],
        [-0.5, 0.5],
        [1, 1],
    ]
    const curve0 = new Quadratic(pts, { stroke: primary, weight: 0.01 })
    draw(ctx, [curve0, pts])

    // points along curve
    pts = range(0, 1, 0.01).map((t) => pointAt(curve0, t))
    // console.log(pts)
    draw(ctx, pts, { fill: secondary })

    // // (1) create a base line of polys (at the origin)
    // const circ0 = new Circle([0, -0.075], 0.05)
    // const circ1 = new Circle([0, 0], 0.05)
    // const circ2 = new Circle([0, 0.075], 0.05)
    // const brushHead = [circ0, circ1, circ2]
    // // draw(ctx, brushHead)

    // // (2) create a path to follow
    // const path = new Line([
    //     [-0.5, 0],
    //     [0.5, 0],
    // ])
    // draw(ctx, path)

    // // (3) for 't' steps, copy the brush head set of polys
    // range(0, 1, 0.01).forEach((t) => {
    //     const trx = pointAt(path, t)
    //     const sxy = mapRange(t, 0, 1, 1.0, 0.6)
    //     const curSet = brushHead.map((poly) => scale(translate(poly, trx), sxy))
    //     draw(ctx, curSet, { fill: primary })
    // })

    // (3) copy last set of polys
    // (4) move poly set towards a directional vector
    // (4a) slightly shrink poly
    // (4b) slightly rotate poly
    // (5) repeat 3-4 keeping the results in a large array

    // TODO: make a slight curve

    // const pos = pointAt(path, 0.0)

    // const polys = []
    // const curSet = [circ]

    // draw(ctx, curSet)
    // translate(curSet, pos)
    // draw(ctx, curSet)

    // console.log(pos)
}
