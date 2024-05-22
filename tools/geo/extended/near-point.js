// Utility function to return the distance between two points
function distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]))
}

/**
 * Finds the nearest points to a target point within a specified maximum distance and count.
 *
 * @param {Object} target - The target point to find the nearest points to.
 * @param {Array} points - The array of points to search from.
 * @param {number} [maxCount=Infinity] - The maximum number of nearest points to return.
 * @param {number} [maxDistance=Infinity] - The maximum distance allowed for a point to be considered as nearest.
 * @returns {Array} - An array of nearest points to the target point.
 * @throws {Error} - If the points array is empty.
 */
export function nearPt(target, points, maxCount = Infinity, maxDistance = Infinity) {
    if (points.length === 0) {
        throw new Error('The points array is empty')
    }

    // Compute the distances of all points from the target
    const distances = points.map((point) => ({
        point,
        dist: distance(point, target),
    }))

    // Filter points within the specified maximum distance
    const filtered = distances.filter((d) => d.dist <= maxDistance)

    // Sort the points by distance
    filtered.sort((a, b) => a.dist - b.dist)

    // Limit the results to the specified maximum count
    const nearestPoints = filtered.slice(0, maxCount).map((d) => d.point)

    return nearestPoints
}
