/**
 * Represents a ray in 2D space.
 *
 * @param {Array<number>} startPoint - The starting point [x, y] of the ray.
 * @param {Array<number>} direction - The direction vector [dx, dy] of the ray.
 */
export class Ray {
    constructor(startPoint, direction) {
        this.startPoint = startPoint
        this.direction = direction
    }

    /**
     * Finds the intersection point of this ray with a line segment.
     *
     * @param {Array<number>} p1 - The first endpoint [x1, y1] of the line segment.
     * @param {Array<number>} p2 - The second endpoint [x2, y2] of the line segment.
     * @returns {(Array<number>|null)} - The intersection point [x, y] or null if no intersection exists.
     */
    findIntersection(p1, p2) {
        const [rx, ry] = this.startPoint
        const [rdx, rdy] = this.direction
        const [x1, y1] = p1
        const [x2, y2] = p2

        // Calculate the denominator
        const denom = rdx * (y1 - y2) - rdy * (x1 - x2)
        if (denom === 0) {
            return null // Lines are parallel or coincident
        }

        // Calculate the numerators for the parameters t and u
        const tNumer = (rx - x1) * (y1 - y2) - (ry - y1) * (x1 - x2)
        const uNumer = (rx - x1) * rdy - (ry - y1) * rdx

        // Calculate the parameters t and u
        const t = tNumer / denom
        const u = -uNumer / denom

        // Check if the intersection is within the ray and line segment
        if (t >= 0 && u >= 0 && u <= 1) {
            // Calculate the intersection point
            const intersectionX = rx + t * rdx
            const intersectionY = ry + t * rdy
            return [intersectionX, intersectionY]
        }

        // No valid intersection
        return null
    }
}
