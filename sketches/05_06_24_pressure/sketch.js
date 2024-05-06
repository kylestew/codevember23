import { createCanvas, setCanvasRange } from 'canvas-utils'
import { circle, line, vertices, polygon, scatter, centroid, center } from '@thi.ng/geom'
import { dist } from '@thi.ng/vectors'
import { fit } from '@thi.ng/math'
import { SYSTEM } from '@thi.ng/random'
import { iterator, transduce, comp, trace, map, minMax } from '@thi.ng/transducers'
import { subdivide, SUBDIV_CHAIKIN_CLOSED } from '@thi.ng/geom-subdiv-curve'
import { draw } from '@thi.ng/hiccup-canvas'

const ctx = createCanvas(1200, 1200, 'sketchCanvas')
setCanvasRange(ctx, -1.2, 1.2)

// converts a guide circle into a blobby shape with given subdivision level output
function chaikin_blob(circ, pre_subdiv, wander, post_subdiv) {
    // ONLY disturb one vert?
    // const verts = vertices(circ, 8)
    // verts[3] = scatter(circle(verts[3], wander), 1)[0]
    // return polygon(subdivide(verts, SUBDIV_CHAIKIN_CLOSED, post_subdiv))

    return polygon(
        subdivide(
            iterator(
                comp(
                    // move those points a bit, randomly in a circle around the point
                    // TODO: use noise instead for more dramatic dimples
                    map((pt) => scatter(circle(pt, wander), 1)[0])
                    // trace()
                ),
                // convert circle to limited # of points
                vertices(circ, pre_subdiv)
            ),
            SUBDIV_CHAIKIN_CLOSED,
            post_subdiv
        )
    )
}

const circ = circle([0, 0], 0.5)
const blob = chaikin_blob(circ, 6, 0.3, 9)

// find the minimum and maximum radius of the blob
const centerPt = centroid(blob)
const radRange = transduce(
    map((pt) => dist(pt, centerPt)),
    minMax(),
    blob.points
)

const lines = [
    ...iterator(
        comp(
            // find the distance and angle of each point from the center
            map((pt) => [pt, dist(pt, centerPt), Math.atan2(pt[1] - centerPt[1], pt[0] - centerPt[0])]),
            // disturb the angle a bit
            map(([pt, d, a]) => {
                const defl = fit(d, radRange[0], radRange[1], 1.2, 0.0)
                return [pt, d, a + SYSTEM.minmax(-defl, defl)]
            }),
            // remap the distance for more dramatic lines
            map(([pt, d, a]) => [pt, fit(d, radRange[0], radRange[1], 1, 0.1), a]),
            // trace(),
            // convert to lines
            map(([pt, d, a]) => line(pt, [pt[0] + Math.cos(a) * d, pt[1] + Math.sin(a) * d]))
        ),

        blob.points
    ),
]

// draw(ctx, ['g', { __background: '#333344', fill: '#ee6699' }, blob])
draw(ctx, ['g', { __background: '#00000000', stroke: '#ee669944', weight: 0.005 }, ...lines])
