import { random, randomInt } from '../util/util.js'
import { Circle, Line } from './geom.js'

/**
 * Enum representing different types of fills.
 * @enum {string}
 */
export const FillType = Object.freeze({
    POINTS: 'points',
    LINES: 'lines',
    DABS: 'dabs',
    BLOBS: 'blobs',
    HATCH: 'hatch',
})

/**
 * Renders a texturizing path in a given rectangle, to be filled or stroked by the caller.
 *
 * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
 * @param {Rectangle} rect - The rectangle to be filled.
 * @param {TexturePathType} type - The type of texture path.
 * @param {boolean} stroke - If true, strokes the shapes; otherwise, fills them.
 * @param {number} density - The density of the texture pattern [0, 1].
 * @param {number} noisiness - The level of noise in the texture features [0, 1].
 * @param {number} featureSize - The size of each texture feature (in pixels).
 * @param {number} featureVariability - The variability in size of each texture feature (in pixels).
 *
 * @returns {Path2D} - The generated texture pattern as a Path2D object.
 */
export function renderFill(ctx, rect, type, stroke, density, noisiness, featureSize, featureVariability) {
    const area = rect.area()
    const iterations = (density * area) / featureSize
    switch (type) {
        case FillType.BLOBS:
            const myIterations = stroke ? iterations * 4 : iterations / 2
            for (let i = 0; i < myIterations; i++) {
                const pt = rect.randomPointIn()
                const r = random(featureSize - featureVariability, featureSize + featureVariability)
                const circ = new Circle(pt, r)
                if (stroke) ctx.stroke(circ.degradedPoly(noisiness).path())
                else ctx.fill(circ.degradedPoly(noisiness).path())
            }
            break

        case FillType.LINES:
            {
                const circ = rect.enclosingCircle()
                const iters = (circ.area() * density) / featureSize
                for (let i = 0; i < iters / 8; i++) {
                    // (1) Pick two random points on containing circle
                    let pt0 = circ.pointAt(random(0.001, 0.999))
                    let pt1 = circ.pointAt(random(0.001, 0.999))

                    // (3) Draw a line between them
                    let line = new Line(pt0, pt1)

                    ctx.lineWidth = random(featureSize - featureVariability, featureSize + featureVariability)
                    ctx.stroke(line.path())
                }
            }
            break

        case FillType.POINTS:
            for (let i = 0; i < iterations * 4; i++) {
                const pt = rect.randomPointIn()
                const r = random(featureSize - featureVariability, featureSize + featureVariability)
                const circ = new Circle(pt, r)
                if (stroke) ctx.stroke(circ.path())
                else ctx.fill(circ.path())
            }
            break

        case FillType.DABS:
            for (let i = 0; i < iterations * 4; i++) {
                // (1) Pick a random point in the rectangle
                const pt = rect.randomPointIn()

                // (2) Pick a random direction to head in
                const pt2 = [
                    pt[0] + random(featureSize - featureVariability, featureSize + featureVariability) * noisiness,
                    pt[1] + random(featureSize - featureVariability, featureSize + featureVariability),
                ]

                // (3) Draw a "short" line in that direction
                const line = new Line(pt, pt2)

                ctx.lineWidth = random(featureSize - featureVariability, featureSize + featureVariability)
                ctx.stroke(line.path())
            }
            break

        case FillType.HATCH:
            for (let i = 0; i < iterations / 4; i++) {
                // (1) Pick two random sides of the rectangle
                const sides = rect.toLines()
                const idx0 = randomInt(0, 4)
                const idx1 = (idx0 + randomInt(1, 4)) % 4

                // (2) Pick random points on each side
                const pct = random(0.001, 0.999)
                const pct2 = 1.0 - pct
                let pt0 = sides[idx0].pointAt(pct)
                let pt1 = sides[idx1].pointAt(pct2)

                // (3) Draw a line between them
                let line = new Line(pt0, pt1)

                // don't complete line
                pt0 = line.pointAt(random(0.001, 0.999))
                pt1 = line.pointAt(random(0.001, 0.999))
                line = new Line(pt0, pt1)

                ctx.lineWidth = random(featureSize - featureVariability, featureSize + featureVariability)
                ctx.stroke(line.path())
            }
            break
    }
}
