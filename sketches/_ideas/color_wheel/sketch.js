import { createCanvas, setCanvasRange } from 'canvas-utils'
import { circle, polygon, vertices } from '@thi.ng/geom'
import { iterator, comp, trace, mapIndexed, partition } from '@thi.ng/transducers'
import { draw } from '@thi.ng/hiccup-canvas'

// define polygon wedges
const WEDGE_COUNT = 24
const coloredWedges = iterator(
    comp(
        // partition pairs of points
        partition(2, 1, true),
        // trace(),
        // convert to polygons and color them
        mapIndexed((idx, pt_pair) => {
            const pt0 = pt_pair[0]
            const pt1 = pt_pair[1] ?? [1, 0]
            return polygon([pt0, pt1, [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
        })
    ),
    // vertices around a circle
    vertices(circle([0, 0], 1), WEDGE_COUNT + 1)
)

const ctx = createCanvas(800, 600, 'sketchCanvas')
setCanvasRange(ctx, -1.1, 1.1)
draw(ctx, ['g', { __background: '#333344' }, ...coloredWedges])
