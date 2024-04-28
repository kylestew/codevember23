import { circle, line, Line, bounds, area, pointAt } from '@thi.ng/geom'
import { IShape, AABBLike } from '@thi.ng/geom-api'
import { SYSTEM } from '@thi.ng/random'

export enum FillType {
    // point,
    lines,
    // POINTS: 'points',
    // LINES: 'lines',
    // DABS: 'dabs',
    // BLOBS: 'blobs',
    // FIBERS: 'fibers'
}

function enclosingCircle(bounds: AABBLike) {
    const centerX = bounds.pos[0] + bounds.size[0] / 2
    const centerY = bounds.pos[1] + bounds.size[1] / 2
    const radius = Math.hypot(bounds.size[0] / 2, bounds.size[1] / 2)
    return circle([centerX, centerY], radius)
}

export function renderFill(
    // ctx: CanvasRenderingContext2D,
    geo: IShape,
    type: FillType,
    // stroke,
    density: number,
    // noisiness,
    featureSize: number
    // featureVariability,
    // colorSampler
) {
    // const area = rect.area()
    // const iterations = (density * area) / featureSize
    switch (type) {
        //     case FillType.BLOBS:
        //         const myIterations = stroke ? iterations * 4 : iterations / 2
        //         for (let i = 0; i < myIterations; i++) {
        //             const pt = rect.randomPointIn()
        //             const r = random(featureSize - featureVariability, featureSize + featureVariability)
        //             const circ = new Circle(pt, r)
        //             if (stroke) ctx.stroke(circ.degradedPoly(noisiness).path())
        //             else ctx.fill(circ.degradedPoly(noisiness).path())
        //         }
        //         break

        case FillType.lines: {
            const circ = enclosingCircle(bounds(geo)!)
            const iters = (area(circ) * density) / featureSize
            let lines: Line[] = []
            for (let i = 0; i < iters / 8; i++) {
                // (1) Pick two random points on containing circle
                let pt0 = pointAt(circ, SYSTEM.float())
                let pt1 = pointAt(circ, SYSTEM.float())

                // (2) Pick a random width for the line
                // ctx.lineWidth = random(featureSize - featureVariability, featureSize + featureVariability)

                // (3) Draw a line between them
                let ln = line([pt0, pt1], { stroke: 'white', weight: 1.0 })
            }
            return lines
        }

        //     case FillType.POINTS:
        //         for (let i = 0; i < iterations * 4; i++) {
        //             const pt = rect.randomPointIn()
        //             const r = random(featureSize - featureVariability, featureSize + featureVariability)
        //             const circ = new Circle(pt, r)
        //             if (stroke) ctx.stroke(circ.path())
        //             else ctx.fill(circ.path())
        //         }
        //         break

        //     case FillType.DABS:
        //         // TODO: these need some attention
        //         for (let i = 0; i < iterations * 4; i++) {
        //             // (1) Pick a random point in the rectangle
        //             const pt = rect.randomPointIn()

        //             // (2) Pick a random direction to head in
        //             // noisiness, featureSize
        //             const pt2 = [
        //                 pt[0] + random(featureSize - featureVariability, featureSize + featureVariability) * noisiness,
        //                 pt[1] + random(featureSize - featureVariability, featureSize + featureVariability),
        //             ]

        //             // (3) Draw a "short" line in that direction
        //             const line = new Line(pt, pt2)

        //             ctx.lineWidth = random(featureSize - featureVariability, featureSize + featureVariability)
        //             ctx.stroke(line.path())
        //         }
        //         break

        //     case FillType.FIBERS:
        //         for (let i = 0; i < iterations; i++) {
        //             // (1) Determine length and width
        //             // fibers are 100x longer than wide
        //             let width = random(featureSize - featureVariability, featureSize + featureVariability)
        //             let length = 20 * width

        //             // (1) Pick a random point in the rectangle
        //             const pt = rect.randomPointIn()

        //             // (2) Pick a random direction to head in
        //             const theta = random(-Math.PI * noisiness, Math.PI * noisiness)

        //             // (3) Draw a "short" line in that direction
        //             const line = Line.fromPointAngleLength(pt, theta, length)

        //             ctx.lineWidth = width
        //             if (colorSampler !== undefined) ctx.strokeStyle = colorSampler(pt)
        //             ctx.stroke(line.path())
        //         break
    }
}
