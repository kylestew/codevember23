import { Polyline } from '../../tools/geo'
import { full, shuffle } from '../../tools/array'
import { random, randomInt, gaussian } from '../../tools/random'
import { mapRange } from '../../tools/math'
import { easeInOutCubic } from '../../tools/math/easings'
import { dist } from '../../tools/math/vectors'
import { draw } from '../../tools/draw'

export function linesNest(ctx, palette) {
    const [bg, primary, secondary] = palette

    // (1) Distribute N random points into an array
    const count = 128
    const pts = full(count, () => [
        // mapRange(easeInOutCubic(random()), 0, 1, -1, 1), //
        // gaussian(0.0, 0.5),
        random(-1, 1),
        // mapRange(easeInOutCubic(random()), 0, 1, -1.6, 1.6), //
        // random(-1.2, 1.2),
        gaussian(0.0, 0.8),
    ])
    // draw(ctx, pts, { stroke: secondary + '33', weight: 0.01 })

    const linePts = []
    // (2) Pick a random point in the array and remove
    let ptA = shuffle(pts).pop()
    for (let i = 0; i < count; i++) {
        // (3) Find the furthest point from the picked point and remove it from the array
        // let maxDist = 0
        // let maxIdx = -1
        // pts.forEach((pt, idx) => {
        //     const distance = dist(ptA, pt)
        //     if (distance > maxDist) {
        //         maxDist = distance
        //         maxIdx = idx
        //     }
        // })

        // (opt) just pick randomly
        const maxIdx = randomInt(0, pts.length - 1)

        // remove point
        const ptB = pts[maxIdx]
        pts.splice(maxIdx, 1)

        // (4) New point becomes the picked point
        linePts.push(ptA)
        ptA = ptB

        // (5) Repeat steps 3-4 until there are no more points
    }

    // (6) Connect points together into a poly line and draw
    ctx.strokeStyle = primary
    ctx.lineWidth = 0.01
    ctx.lineJoin = 'round'

    const half = Math.ceil((linePts.length / 3) * 2)
    const firstHalf = linePts.slice(0, half)
    const secondHalf = linePts.slice(half)

    ctx.moveTo(firstHalf[0][0], firstHalf[0][1])
    for (let i = 1; i < firstHalf.length - 4; i++) {
        ctx.bezierCurveTo(
            firstHalf[i][0],
            firstHalf[i][1],
            firstHalf[i + 1][0],
            firstHalf[i + 1][1],
            firstHalf[i + 2][0],
            firstHalf[i + 2][1]
        )
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = secondary
    ctx.moveTo(secondHalf[0][0], secondHalf[0][1])
    for (let i = 1; i < secondHalf.length - 4; i++) {
        ctx.bezierCurveTo(
            secondHalf[i][0],
            secondHalf[i][1],
            secondHalf[i + 1][0],
            secondHalf[i + 1][1],
            secondHalf[i + 2][0],
            secondHalf[i + 2][1]
        )
    }
    ctx.stroke()

    // const polyline = new Polyline(linePts)
    // draw(ctx, polyline, { stroke: primary, weight: 0.01, lineJoin: 'round' })

    // TODO: opt convert to curves
}
