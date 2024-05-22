import { Circle } from '../tools/geo'
import { full, zip } from '../tools/array'
import { random, gaussian, pickRandom } from '../tools/random'
import { pointClipLogarithmic, pointClipSigmoid, pointClipExponential, pointClipSmooth } from '../tools/math/clipping'
import { setCanvasRange } from '../tools/canvas-utils'
import { draw } from '../tools/draw'

export function distroShaping(ctx, palette) {
    const [bg, primary, secondary] = palette

    ctx.resetTransform()
    ctx.setRange(ctx, -1.0, 1.0)

    // randomly select N seed points in canvas area
    const n = 9
    const seedPts = full(n, () => [random(-1, 1), random(-1, 1)])

    // randomly select spreads
    const spreads = full(n, () => random(0.05, 0.6))

    // randomly select colors
    const colors = full(n, () => pickRandom([primary, secondary]))

    const distroBlobs = zip(seedPts, spreads, colors)

    function render() {
        ctx.clear(bg)

        const pointRemapFn = pointClipSmooth
        // const pointRemapFn = pointClipExponential
        // samples = samples.map((pt) => pointClipLogarithmic(pt, 0.5))

        // take N random samples
        const sampleCount = 200_000
        let samples = full(sampleCount, () => {
            const [pt, spread, color] = pickRandom(distroBlobs)
            let centerPt = [gaussian(pt[0], spread), gaussian(pt[1], spread)]
            centerPt = pointRemapFn(centerPt, 0.5)
            return new Circle(centerPt, random(0.001, 0.003), { fill: color + '99' })
        })

        draw(ctx, samples)
        // requestAnimationFrame(render)
    }
    render()

    // TODO: blow away some of the circles
    // compress

    // // preset list of distributions
    // const spread = 0.1
    // const gaussStops = [
    //     [-2.0, 0.16],
    //     [-1.5, 0.14],
    //     [-1.0, 0.12],
    //     [-0.5, 0.1],
    //     [-0.0, 0.08],
    //     [0.5, 0.1],
    //     [1.0, 0.12],
    //     [1.5, 0.14],
    //     [2.0, 0.16],
    // ]

    // const something = () => {
    //     const y = random(-1, 1)
    //     const [a, b] = pickRandom(gaussStops)
    //     const x = gaussian(a, b)

    //     return [x + Math.sin(y * 1.333), y]
    // }
}
