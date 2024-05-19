// import { SYSTEM, uniform, gaussian, exponential, normal } from '@thi.ng/random'
import { Line } from '../tools/geo'
import { full } from '../tools/array'
import { setCanvasRange } from '../tools/canvas-utils'
import { draw } from '../tools/draw'
import { random, gaussian } from '../tools/random'

export function distros(ctx, palette) {
    const [bg, primary, secondary] = palette

    ctx.resetTransform()
    setCanvasRange(ctx, -0.1, 1.1)

    const count = 256
    const height = 0.22

    let lines = []
    let yPos = 0.0

    function lineWithRandomFn(fn) {
        return function () {
            const x = fn()
            return new Line([x, yPos], [x, yPos + height])
        }
    }

    // ## DISTRIBUTIONS (from bottom to top)
    // # (1) uniform random (Math.random)
    lines.push(full(count, lineWithRandomFn(random)))

    // # (2) normal (gausian) distribution
    yPos += height * 1.2
    lines.push(
        full(
            count,
            lineWithRandomFn(() => gaussian(0.5, 0.1))
        )
    )

    // # (3) normal
    // # (4) exponential (power?)

    draw(ctx, lines, { stroke: primary, weight: 0.002 })
}
