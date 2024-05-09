import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, asPath, vertices } from './tools/geo'
import { partition } from './tools/array'

// circle -> vertices -> partition into pairs -> map to polygons using center point
const WEDGE_COUNT = 8
const circ = new Circle([0, 0], 1)
const verts = vertices(circ, WEDGE_COUNT)
verts.push(verts[0]) // loop back to the start
const polys = partition(verts, 2, 1, false).map((pair, idx) => {
    const pt0 = pair[0]
    const pt1 = pair[1] ?? [1, 0]
    return new Polygon([pt0, pt1, [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
})

const ctx = createCanvas(800, 600)
ctx.background('#333344')
setCanvasRange(ctx, -1.1, 1.1)

// TODO: drawing function that applies attribs
for (const poly of polys) {
    ctx.fillStyle = poly.attribs.fill
    ctx.fill(asPath(poly))
}
