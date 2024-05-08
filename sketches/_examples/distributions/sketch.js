import { createCanvas, setCanvasRange } from 'canvas-utils'
import { line } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'
import { SYSTEM, uniform, gaussian, exponential, normal } from '@thi.ng/random'

const ctx = createCanvas(960, 960, 'sketchCanvas')
ctx.background('#333344')
setCanvasRange(ctx, -0.1, 1.1)

const count = 512
const height = 0.22

let lines = []
let yPos = 0.0

function makeRandomLine(fn) {
    return function () {
        const x = fn()
        return line([x, yPos], [x, yPos + height])
    }
}

// ## DISTRIBUTIONS (from bottom to top)
// # (1) uniform random (Math.random)
lines.push(...Array.from({ length: count }, makeRandomLine(uniform(SYSTEM, 0, 1))))

// # (2) gausian
yPos += height * 1.2
const gauss = gaussian(SYSTEM, 24, 0.5, 1.0)
lines.push(...Array.from({ length: count }, makeRandomLine(gauss)))

// # (3) normal
yPos += height * 1.2
const norm = normal(SYSTEM, 0.5, 0.1)
lines.push(...Array.from({ length: count }, makeRandomLine(norm)))

// # (4) exponential (power?)
yPos += height * 1.2
const expo = exponential(SYSTEM, 10)
lines.push(...Array.from({ length: count }, makeRandomLine(expo)))

draw(ctx, ['g', { stroke: '#ffffff99', weight: 0.001 }, ...lines])
