import { Circle } from '../tools/geo/'
import { asPoints } from '../tools/geo/ops'
// import { random, randomInt } from '../tools/random'
// import { shuffle } from '../tools/array'
// import { color } from '../tools/color'
// import { floodFillAlgorithm } from '../tools/tex/flood-fill'
import { draw } from '../tools/draw'

/* https://www.amygoodchild.com/blog/curved-line-jellyfish */
export function jellyfish(ctx, palette) {
    const [bg, primary, secondary] = palette

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 0.01
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(0, 0)
    // ctx.lineTo(1, 1)
    ctx.quadraticCurveTo(0, 1, 1, 1)
    // ctx.closePath()
    ctx.stroke()

    const circ = new Circle([0.5, 0.5], 0.5)
    draw(ctx, circ)
}
