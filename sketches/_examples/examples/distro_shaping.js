import {} from '../tools/geo'
import { full } from '../tools/array'
import { mapRange, clamp } from '../tools/math'
import { setCanvasRange } from '../tools/canvas-utils'
import { draw } from '../tools/draw'

import { random, gaussian, pickRandom } from '../tools/random'
// import { easeInQuad, easeInExpo, easeInOutCubic, easeOutInCubic } from '../tools/math/easings'

export function distroShaping(ctx, palette) {
    const [bg, primary, secondary] = palette

    ctx.resetTransform()
    setCanvasRange(ctx, -1.0, 1.0)

    const spread = 0.1
    const gaussStops = [
        [-2.0, spread],
        [-1.5, spread],
        [-1.0, spread],
        [-0.5, spread],
        [-0.0, spread],
        [0.5, spread],
        [1.0, spread],
        [1.5, spread],
        [2.0, spread],
    ]

    const something = () => {
        const y = random(-1, 1)
        const [a, b] = pickRandom(gaussStops)
        const x = gaussian(a, b)

        return [x + Math.sin(y * 1.5), y]
    }

    const sampleCount = 300_000
    const samples = full(sampleCount, something)

    draw(ctx, samples, { fill: primary, weight: 0.002 })
}
