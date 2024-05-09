import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { Circle, Polygon, asPath, vertices } from './tools/geo'
import { partition } from './tools/array'
import { draw } from './tools/draw'

// circle -> vertices -> partition into pairs -> map to polygons using center point
const WEDGE_COUNT = 24
const circ = new Circle([0, 0], 1)
const verts = vertices(circ, WEDGE_COUNT)
verts.push(verts[0]) // loop back to the start
const polys = partition(verts, 2, 1, false).map(
    (pair, idx) => new Polygon([pair[0], pair[1], [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
)

const ctx = createCanvas(800, 600)
ctx.background('#333344')
setCanvasRange(ctx, -1.1, 1.1)

draw(ctx, polys)
draw(ctx, circ, { stroke: '#ffffff', weight: 0.05 })
