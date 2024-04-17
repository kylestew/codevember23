import { Vec } from '@thi.ng/vectors'
import { iterator, trace, comp, map, push, flatten1, partition } from '@thi.ng/transducers'
import { line, splitAt } from '@thi.ng/geom'

/**
 * Generates a Chaikin curve based on the given points and number of iterations.
 *
 * @param points - The input points for the curve.
 * @param iterations - The number of iterations to perform.
 * @returns The generated Chaikin curve as an array of points.
 */
export function chaikinCurve(points: Vec[], iterations: number): Vec[] {
    if (iterations === 0) return points
    // need to add back in endpoints
    const smooth = [points[0], ...chaikinSubdivide(points), points[points.length - 1]]
    return iterations === 1 ? smooth : chaikinCurve(smooth, iterations - 1)
}

/**
 * Subdivides the given points using the Chaikin algorithm.
 *
 * @param points - The input points to subdivide.
 * @returns The subdivided points.
 */
function chaikinSubdivide(points: Vec[]): Vec[] {
    return [
        ...iterator(
            comp(
                // read array in pairs
                partition(2, 1),
                // chop corners off by taking only the inner points (0.25, 0.75)
                map(([a, b]) => {
                    return [
                        [0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]],
                        [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]],
                    ]
                }),
                flatten1()
                // trace()
            ),
            points
        ),
    ]
}
