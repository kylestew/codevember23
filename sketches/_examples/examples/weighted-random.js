import { Circle } from '../tools/geo'
import { full } from '../tools/array'
import { random, weightedRandom } from '../tools/random'
import { draw } from '../tools/draw'

export function weightedRandomDemo(ctx, palette) {
    const [bg, primary, secondary] = palette

    const options = [
        [() => 0.4, { fill: primary }],
        [() => random(0.05, 0.15), { stroke: primary, weight: 0.01 }],
        [() => 0.25, { fill: secondary }],
    ]

    const count = 100
    draw(
        ctx,
        full(count, () => {
            const x = random(-1, 1)
            const y = random(-1, 1)

            const choice = weightedRandom([1, 16, 2])
            const [fnR, attribs] = options[choice]

            return new Circle([x, y], fnR(), attribs)
        })
    )
}
