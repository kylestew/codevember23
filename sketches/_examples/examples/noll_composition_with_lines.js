import { Circle, Rectangle, Polygon, Ellipse, Line } from '../tools/geo/shapes'
import { scatter, asPolygon, bounds, area } from '../tools/geo/ops'
import { randomBool } from '../tools/random'
import { Grid } from '../tools/geo/extended'
import { draw } from '../tools/draw'

/* https://collections.vam.ac.uk/item/O1193787/computer-composition-with-lines-photograph-a-michael-noll/#:~:text=This%20is%20a%20photographic%20print,With%20Lines%22%20by%20Piet%20Mondrian. */
export function compositionWithLines(ctx, palette) {
    let [bg, primary, secondary] = palette

    // grid for layout
    const grid = new Grid([-1, 1], [2, -2], 2, 2)
    const centers = grid.centers()

    const ptCount = 256
    function doScatter(shape) {
        const pts = scatter(shape, ptCount)

        console.log(area(shape))

        // draw random 90 degree lines
        const lines = pts.map((pt) => {
            const rot = randomBool() ? Math.PI / 2 : 0
            const length = 0.05
            return Line.withCenter(pt, rot, length)
        })

        return lines
    }

    const circ = new Circle(centers[0], 0.4)
    // draw(ctx, circ, { stroke: secondary, weight: 0.01 })
    draw(ctx, doScatter(circ))

    const square = Rectangle.withCenter(centers[1], [0.8, 0.8])
    // draw(ctx, square, { stroke: secondary, weight: 0.01 })
    draw(ctx, doScatter(square))

    // const poly = asPolygon(new Circle(centers[2], 0.4), 5)
    // // draw(ctx, poly, { stroke: secondary, weight: 0.01 })
    // draw(ctx, doScatter(poly))

    // const ellipse = new Ellipse(centers[3], [0.2, 0.4], -Math.PI / 3.0)
    // // draw(ctx, ellipse, { stroke: secondary, weight: 0.01 })
    // draw(ctx, doScatter(ellipse))
}
