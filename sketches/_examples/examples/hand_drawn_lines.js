import { Line, Polyline } from '../tools/geo'
import { asPoints } from '../tools/geo'
import { zip, range } from '../tools/array'
import { random, randomOffset } from '../tools/random'
import { add } from '../tools/math/vectors'
import { chaikinCurve } from '../tools/algos/chaikin'
import { smoothPoints } from '../tools/algos/smoothing'
import { draw } from '../tools/draw'

export function handDrawnLines(ctx, palette) {
    const [bg, primary, secondary] = palette

    function makeHorizontalLines(num, deviation = 0.03) {
        // make 2 vertical control lines
        const lineA = new Line([-1, -1.0], [-1, 1.0])
        const lineB = new Line([1, -1.0], [1, 1.0])

        // turn each line into endpoints for the new set of horizontal lines
        let ptsStart = asPoints(lineA, numLines)
        let ptsEnd = asPoints(lineB, numLines)

        // move endpoints around a bit
        ptsStart = ptsStart.map((pt) => [pt[0] + random(-deviation, deviation), pt[1] + random(-deviation, deviation)])
        ptsEnd = ptsEnd.map((pt) => [pt[0] + random(-deviation, deviation), pt[1] + random(-deviation, deviation)])

        // zip up the points into lines
        return zip(ptsStart, ptsEnd).map(([ptA, ptB]) => new Line(ptA, ptB))
    }

    const numLines = 128
    const horizontalLines = makeHorizontalLines(numLines)

    // (1) Break the line into major points and disturb them
    const majorBreaks = 16
    const largeFeatureRandomness = 0.05
    const largeFeatures = horizontalLines.map((line) =>
        asPoints(line, majorBreaks).map((pt) => add(pt, randomOffset(-largeFeatureRandomness, largeFeatureRandomness)))
    )

    // (2) Apply smoothing
    //     // apply kernel smoothing to the points
    //     linePoints = smoothPoints(linePoints, smoothing)

    // (2) Create multiple copies of each line disturbing the line points a little bit each time
    const sublineCount = 16
    const smallFeatureRandomness = 0.01
    // TODO: change the randomness function to a normal distribution
    const smallFeatures = largeFeatures.flatMap((linePoints) => {
        let newLines = []
        range(sublineCount).forEach((i) => {
            newLines.push(
                linePoints.map((pt) => add(pt, randomOffset(-smallFeatureRandomness, smallFeatureRandomness)))
            )
        })
        return newLines
    })

    // (3) Chaikin curve algorithm to get curves
    const curvePoints = smallFeatures.map((linePoints) => chaikinCurve(linePoints, 4))

    // (4) Draw small lines
    // TODO: draw as sand dots
    // https://www.generativehut.com/post/how-to-make-generative-art-feel-natural
    const polylines = curvePoints.map((lines) => new Polyline(lines))

    draw(ctx, polylines, { stroke: primary, weight: 0.001 })
}
