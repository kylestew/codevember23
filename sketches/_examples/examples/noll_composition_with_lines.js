import { Circle, Rectangle, Polygon, Ellipse, Line } from '../tools/geo/shapes'
import { scatter, asPolygon, bounds, area, centerRotate } from '../tools/geo/ops'
import { randomBool, random } from '../tools/random'
import { animate } from '../tools/canvas-utils/animate'
import { Grid } from '../tools/geo/extended'
import { draw } from '../tools/draw'

/* https://collections.vam.ac.uk/item/O1193787/computer-composition-with-lines-photograph-a-michael-noll/#:~:text=This%20is%20a%20photographic%20print,With%20Lines%22%20by%20Piet%20Mondrian. */
export function compositionWithLines(ctx, palette) {
    let [bg, primary, secondary] = palette

    function render(timestamp) {
        ctx.clear(bg)

        // grid for layout
        const grid = new Grid([-1, 1], [2, -2], 2, 2)
        const centers = grid.centers()

        const ptCount = 600
        function doScatter(shape) {
            const pts = scatter(shape, Math.floor(ptCount * area(shape)))

            // draw random 90 degree lines
            return pts.map((pt) => {
                const rot = randomBool() ? Math.PI / 2 : 0
                const length = random(0.007, 0.07)
                return Line.withCenter(pt, rot, length, { stroke: primary, weight: 0.008 })
            })
        }

        const circ = new Circle(centers[0], 0.45)
        // draw(ctx, circ, { stroke: secondary, weight: 0.01 })
        draw(ctx, doScatter(circ))

        const square = Rectangle.withCenter(centers[1], [0.9, 0.9])
        // draw(ctx, square, { stroke: secondary, weight: 0.01 })
        draw(ctx, doScatter(square))

        const poly = centerRotate(asPolygon(new Circle(centers[2], 0.45), 5), timestamp / 2000.0)
        // draw(ctx, poly, { stroke: secondary, weight: 0.01 })
        draw(ctx, doScatter(poly))

        // const ellipse = new Ellipse(centers[3], [0.25, 0.45], -Math.PI / 3.0)
        const ellipse = new Ellipse(centers[3], [0.25, 0.45], -Math.PI / 3.0)
        // draw(ctx, ellipse, { stroke: secondary, weight: 0.01 })
        draw(ctx, doScatter(ellipse))
    }
    animate(10, render)
}
