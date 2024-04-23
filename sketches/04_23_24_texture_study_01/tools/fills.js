import { random, randomInt } from '../util/util.js'
import { Circle } from './geom.js'

/**
 * Enum representing different types of fills.
 * @enum {string}
 */
export const FillType = Object.freeze({
    POINTS: 'points',
    LINES: 'lines',
    DABS: 'dabs',
    BLOBS: 'blobs',
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
            // TODO: layer larger and smaller values over time
            // Randomly put large patches at beginning with higher opacity?
            for (let i = 0; i < iterations / 50; i++) {
                const pt = rect.randomPointIn()
                const r = featureSize * 8
                const circ = new Circle(pt, r)
                ctx.fill(circ.degradedPoly(noisiness).path())
            }
            for (let i = 0; i < iterations; i++) {
                const pt = rect.randomPointIn()
                const r = random(featureSize - featureVariability, featureSize + featureVariability)
                const circ = new Circle(pt, r)
                if (stroke) ctx.stroke(circ.degradedPoly(noisiness).path())
                else ctx.fill(circ.degradedPoly(noisiness).path())
            }
            break

        case FillType.CIRCLES: // TODO: this becomes above but as strokes
            // {
            //     const iterations = density * (area / 10)
            //     for (let i = 0; i < iterations; i++) {
            //         const pt = rect.randomPointIn()
            //         const r = random(featureSize - featureVariability, featureSize + featureVariability)
            //         const circ = new Circle(pt, r)
            //         ctx.lineWidth = random(1.0, 1.0 + featureVariability / 4.0)
            //         path.addPath(circ.path())
            //     }
            // }
            break
        case FillType.LINES:
            // {
            //     const iterations = density * (area / 100)
            //     for (let i = 0; i < iterations; i++) {
            //         // (1) Pick two random sides of the rectangle
            //         // (2) Pick random points on each side
            //         // (3) Draw a line between them
            //         // const pt = rect.randomPointIn()
            //         // const r = random(featureSize - featureVariability, featureSize + featureVariability)
            //         // const circ = new Circle(pt, r)
            //         // ctx.lineWidth = random(1.0, 1.0 + featureVariability / 4.0)
            //         // ctx.stroke(circ.path())
            //     }
            // }
            break
    }
}
