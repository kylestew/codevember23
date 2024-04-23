import { random } from '../util/util.js'
import { Circle } from '../tools/geom.js'

export const TextureFill = Object.freeze({
    POLYS: 'polys',
    CIRCLES: 'circles',
})

/**
 * Fills the given rectangle with a shape based generated pattern.
 *
 * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
 * @param {Rectangle} rect - The rectangle to be filled.
 * @param {number} density - The density of the texture pattern [0, 1]
 * @param {number} featureSize - The size of each texture feature (in pixels).
 * @param {number} featureVariability - The variability in size of each texture feature (in pixels)
 */
export function textureFill(ctx, type, rect, density, featureSize, featureVariability) {
    const area = rect.area()

    switch (type) {
        case TextureFill.POLYS:
            const iterations = density * (area / 10)
            for (let i = 0; i < iterations; i++) {
                const pt = rect.randomPointIn()
                const r = random(featureSize - featureVariability, featureSize + featureVariability)
                const circ = new Circle(pt, r)
                ctx.fill(circ.degradedPoly(0.2).path())
            }
            break

        case TextureFill.CIRCLES:
            throw new Error('Not implemented')
            break
    }
}
