import { createCanvas, setCanvasRange } from 'canvas-utils'
import { circle, rectFromMinMax, scatter, vertices, polygon, resample, centroid } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'
import { SYSTEM, gaussian } from '@thi.ng/random'
import { subdivide, SUBDIV_CHAIKIN_CLOSED } from '@thi.ng/geom-subdiv-curve'

const ctx = createCanvas(1080, 1920, 'sketchCanvas')
const canvasRange = setCanvasRange(ctx, -1.0, 1.0)
const canvasRect = rectFromMinMax(canvasRange.min, canvasRange.max)

// gererate 5 random circles in canvas and convert to polygons
let polys = scatter(canvasRect, 9).map((pt) => polygon(vertices(circle(pt, SYSTEM.minmax(0.2, 0.4)), 12)))

function loop() {
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#333344'
    ctx.fillRect(canvasRect.pos[0], canvasRect.pos[1], canvasRect.size[0], canvasRect.size[1])

    // ctx.globalCompositeOperation = 'color-dodge'
    // ctx.globalCompositeOperation = 'source-in'
    // ctx.globalCompositeOperation = 'source-atop'
    ctx.globalCompositeOperation = 'xor'
    // ctx.globalCompositeOperation = 'overlay'
    // ctx.globalCompositeOperation = 'screen'
    // ctx.globalCompositeOperation = 'darken'
    // ctx.globalCompositeOperation = 'color-burn'
    // ctx.globalCompositeOperation = 'hard-light'
    // ctx.globalCompositeOperation = 'difference'
    // ctx.globalCompositeOperation = 'exclusion'

    polys = polys.map((poly) => {
        // wander points of polygon
        const step = 0.002
        const center = centroid(poly)
        const pts = poly.points.map(([x, y]) => {
            // angle away from center
            let angle = Math.atan2(y - center[1], x - center[0])
            // const angle = SYSTEM.float() * Math.PI * 2
            // wander angle
            angle += gaussian(SYSTEM, 24, 0, 16)()
            // normalize angle
            angle = (angle + 2 * Math.PI) % (2 * Math.PI)
            // console.log(gaussian()())
            return [x + step * Math.cos(angle), y + step * Math.sin(angle)]
        })

        // smooth the points, convert to smooth polygon for display
        const smoothPoly = polygon(subdivide(pts, SUBDIV_CHAIKIN_CLOSED, 4))

        // DISPLAY!!!
        draw(ctx, ['g', { fill: '#ee6699' }, smoothPoly])
        // debug points
        // draw(ctx, ['g', {}, ...map((pt) => circle(pt, 0.02, { fill: '#fff' }), pts)])

        // rebuild polygon from new points positions for next loop
        return polygon(pts)
    })
    requestAnimationFrame(loop)
}
loop()
