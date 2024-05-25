import { Circle, Rectangle, Polygon, Ellipse } from '../../tools/geo/shapes'
import { Grid } from '../../tools/geo/extended/grid'
import { asPolygon, scatter, bounds } from '../../tools/geo/ops'
import { draw } from '../../tools/draw'

export function pointInsideDemo(ctx, palette) {
    const [bg, primary, secondary] = palette

    const grid = new Grid([-1, -1], [2, 2], 2, 2)

    const centers = grid.centers()
    const ptCount = 120

    const circ = new Circle(centers[0], 0.4)
    draw(ctx, circ, { stroke: primary, weight: 0.01 })
    draw(ctx, scatter(circ, ptCount), { stroke: secondary, weight: 0.01 })

    const square = Rectangle.withCenter(centers[1], [0.8, 0.8])
    draw(ctx, square, { stroke: primary, weight: 0.01 })
    draw(ctx, scatter(square, ptCount), { stroke: secondary, weight: 0.01 })

    const poly = asPolygon(new Circle(centers[2], 0.4), 5)
    draw(ctx, poly, { stroke: primary, weight: 0.01 })
    draw(ctx, scatter(poly, ptCount), { stroke: secondary, weight: 0.01 })

    const ellipse = new Ellipse(centers[3], [0.2, 0.4], -Math.PI / 3.0)
    draw(ctx, ellipse, { stroke: primary, weight: 0.01 })
    draw(ctx, scatter(ellipse, ptCount), { stroke: secondary, weight: 0.01 })
}
