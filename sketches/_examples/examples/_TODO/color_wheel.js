import { Circle, Polygon, asPoints } from '../../tools/geo'
import { partition, wrapSides } from '../../tools/array'
import { draw } from '../../tools/draw'

export function colorWheel(ctx, palette) {
    // circle -> vertices -> partition into pairs -> map to polygons using center point

    const WEDGE_COUNT = 24
    const circ = new Circle([0, 0], 1)
    let pts = asPoints(circ, WEDGE_COUNT)

    pts = wrapSides(pts, 0, 1)
    const polys = partition(pts, 2, 1, false).map(
        (pair, idx) => new Polygon([pair[0], pair[1], [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
    )

    draw(ctx, polys)
    draw(ctx, circ, { stroke: '#ffffff', weight: 0.05 })
}
