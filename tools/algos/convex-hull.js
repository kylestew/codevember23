// Helper function to find the orientation of the triplet (p, q, r).
// Returns:
// 0 if p, q and r are collinear
// 1 if Clockwise
// 2 if Counterclockwise
function orientation(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
    if (val === 0) return 0 // collinear
    return val > 0 ? 1 : 2 // clock or counterclock wise
}

// A function used by sort() to compare two points with respect to the first point
function compare(p0, p1, p2) {
    const o = orientation(p0, p1, p2)
    if (o === 0) {
        return distSq(p0, p2) >= distSq(p0, p1) ? -1 : 1
    }
    return o === 2 ? -1 : 1
}

// Utility function to return square of distance between p1 and p2
function distSq(p1, p2) {
    return (p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1])
}

// The main function that returns the convex hull of a set of n points
export function convexHull(points) {
    const n = points.length

    // Find the bottom-most point
    let ymin = points[0][1],
        min = 0
    for (let i = 1; i < n; i++) {
        const y = points[i][1]

        // Pick the bottom-most or choose the left most point in case of tie
        if (y < ymin || (ymin === y && points[i][0] < points[min][0])) {
            ymin = points[i][1]
            min = i
        }
    }

    // Place the bottom-most point at first position
    ;[points[0], points[min]] = [points[min], points[0]]

    // Sort n-1 points with respect to the first point. A point p1 comes before p2 in sorted output if p2
    // has larger polar angle (in counterclockwise direction) than p1
    const p0 = points[0]
    points = points.slice(1).sort((a, b) => compare(p0, a, b))
    points.unshift(p0)

    // Create an empty stack and push first three points to it.
    const stack = [points[0], points[1], points[2]]

    // Process remaining n-3 points
    for (let i = 3; i < n; i++) {
        // Keep removing top while the angle formed by points next-to-top, top, and points[i] makes a right turn
        while (stack.length > 1 && orientation(stack[stack.length - 2], stack[stack.length - 1], points[i]) !== 2) {
            stack.pop()
        }
        stack.push(points[i])
    }

    return stack
}
