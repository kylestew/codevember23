import { circle, Circle, line, bounds, area, pointAt, scatter, polygon, Polygon } from '@thi.ng/geom'
import { IShape, AABBLike } from '@thi.ng/geom-api'
import { SYSTEM } from '@thi.ng/random'
import { iterator, comp, mapcat, flatten1, range, map, trace, repeatedly } from '@thi.ng/transducers'
// import { randomSample } from '@thi.ng/iterators'

function enclosingCircle(bounds: AABBLike) {
    const centerX = bounds.pos[0] + bounds.size[0] / 2
    const centerY = bounds.pos[1] + bounds.size[1] / 2
    const radius = Math.hypot(bounds.size[0] / 2, bounds.size[1] / 2)
    return circle([centerX, centerY], radius)
}

function circleToBlob(circ: Circle, degradation: number): Polygon {
    const [x, y] = circ.pos
    return polygon([
        ...iterator(
            comp(
                // convert to ordered but points on circle
                map((angle) => {
                    const theta = angle + (SYSTEM.float() * 2.0 - 1.0) * degradation

                    const rad = circ.r + circ.r * SYSTEM.minmax(-degradation, degradation)
                    return [x + Math.cos(theta) * rad, y + Math.sin(theta) * rad]
                })
            ),
            // circle angles in 8 steps
            range(0.0, 2.0 * Math.PI, Math.PI / 4.0)
            // sorted list of random angles from 0 to 2 * PI
            // [...repeatedly(() => SYSTEM.float() * 2.0 * Math.PI, 16)].sort()
        ),
    ])
}

/**
 * Generates lines within a circle that encloses the given shape.
 * A circle is used for more even distribution
 *
 * @param geo - The shape to generate lines within.
 * @param density - The density of lines to generate.
 *
 * @returns An iterable iterator of shapes representing the generated lines.
 */
export function* genLinesIn(geo: IShape, density: number): IterableIterator<IShape> {
    const circ = enclosingCircle(bounds(geo)!)
    const count = Math.floor(area(circ) * density)

    // yield `count` lines within bounding circle
    for (let i = 0; i < count; i++) {
        let pt0 = pointAt(circ, SYSTEM.float())
        let pt1 = pointAt(circ, SYSTEM.float())
        yield line([pt0, pt1])
    }

    // ...repeatedly(
    // 	() => add2(null, randNormDistrib2([], SYSTEM.float(r * r) ** 0.5), pos),
    // 	num
    // ),
}

export function genBlobsIn(geo: IShape, density: number, size: number, randomness: number): IterableIterator<Polygon> {
    const count = Math.floor(area(geo) * density)
    return iterator(
        comp(
            // random point -> circle
            map((pt) => circle(pt, size * SYSTEM.minmax(1.0 - randomness, 1.0 + randomness))),
            // circle -> blob
            map((circ) => circleToBlob(circ, randomness))
        ),
        scatter(geo, count)
    )
}

/*
export function createFill(
    geo: IShape,
    type: FillType,
    density: number
    // featureSize: number
    // variability: number,
) {
    // const area = rect.area()
    // const iterations = (density * area) / featureSize
    switch (type) {


        case FillType.lines: {

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
*/
