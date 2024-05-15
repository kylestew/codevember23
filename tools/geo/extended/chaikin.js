/**
 * Generates a Chaikin curve based on the given points and number of iterations.
 *
 * @param points - The input points for the curve.
 * @param iterations - The number of iterations to perform.
 * @returns The generated Chaikin curve as an array of points.
 */
export function chaikinCurve(points, iterations) {
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
function chaikinSubdivide(points) {
    const result = []

    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i]
        const b = points[i + 1]

        const p1 = [0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]
        const p2 = [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]

        result.push(p1, p2)
    }

    return result
}
