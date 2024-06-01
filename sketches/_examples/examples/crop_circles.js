import { Line } from '../tools/geo'
import { random } from '../tools/random'
import { draw } from '../tools/draw'

export function cropCircles(ctx, palette) {
    const [bg, primary, secondary] = palette

    // slanted line
    const randomRotation = random(-Math.PI, Math.PI)
    // somewhere near the center
    Line.withCenter([0, 0], randomRotation)

    // new Line()
}
