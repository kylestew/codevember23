/**
 * Generates a Chaikin curve based on the given points and number of iterations.
 *
 * @param {Array} points - The input points for the curve.
 * @param {number} iterations - The number of iterations to perform.
 * @param {boolean} closed - Whether the polygon is closed or not.
 * @returns {Array} The generated Chaikin curve as an array of points.
 */
export function chaikinCurve(points, iterations, closed = false) {
    if (iterations === 0) return points
    // Chaikin subdivision with consideration for closed or open polygons
    const smooth = chaikinSubdivide(points, closed)
    return iterations === 1 ? smooth : chaikinCurve(smooth, iterations - 1, closed)
}

/**
 * Subdivides the given points using the Chaikin algorithm.
 *
 * @param {Array} points - The input points to subdivide.
 * @param {boolean} closed - Whether the polygon is closed or not.
 * @returns {Array} The subdivided points.
 */
function chaikinSubdivide(points, closed) {
    const result = []
    const n = points.length

    for (let i = 0; i < n - 1; i++) {
        const a = points[i]
        const b = points[i + 1]

        const p1 = [0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]
        const p2 = [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]

        result.push(p1, p2)
    }

    if (closed) {
        const a = points[n - 1]
        const b = points[0]

        const p1 = [0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]
        const p2 = [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]

        result.push(p1, p2)
    } else {
        result.unshift(points[0])
        result.push(points[n - 1])
    }

    return result
}
