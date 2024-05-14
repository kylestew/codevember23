export class Arc {
    /**
     * Creates an Arc object
     *
     * @constructor
     * @param {Object} pos - The position of the object.
     * @param {number} r - The radius of the object.
     * @param {number} start - The starting angle of the object.
     * @param {number} end - The ending angle of the object.
     * @param {boolean} [clockwise=false] - Indicates whether the object is drawn in a clockwise direction.
     */
    constructor(pos, r, start, end, clockwise = false, attribs = {}) {
        this.pos = pos
        this.r = r
        this.start = start
        this.end = end
        this.clockwise = clockwise
        this.attribs = attribs
    }
}

export class Circle {
    /**
     * Creates a Circle object
     *
     * @constructor
     * @param {Object} pos - The position of the object.
     * @param {number} r - The radius of the object.
     */
    constructor(pos, r, attribs = {}) {
        this.pos = pos
        this.r = r
        this.attribs = attribs
    }

    from2Points(p1, p2, attribs = {}) {}
}

export class Ellipse {}

export class Line {
    /**
     * Represents a line segment in a geometric space.
     *
     * @constructor
     * @param {Point} start - The starting point of the line segment.
     * @param {Point} end - The ending point of the line segment.
     */
    constructor(start, end, attribs = {}) {
        this.pts = [start, end] // Store start and end points as an array
        this.attribs = attribs
    }

    //     static fromMidpointAndAngle(pt, angle, length) {
    //         const dx = Math.cos(angle)
    //         const dy = Math.sin(angle)
    //         const halfLength = length / 2
    //         const startPoint = [pt[0] - dx * halfLength, pt[1] - dy * halfLength]
    //         const endPoint = [pt[0] + dx * halfLength, pt[1] + dy * halfLength]
    //         return new Line(startPoint, endPoint)
    //     }
    //     // length() {
    //     //     const dx = this.pts[1].x - this.pts[0].x
    //     //     const dy = this.pts[1].y - this.pts[0].y
    //     //     return Math.sqrt(dx * dx + dy * dy)
    //     // }
}

export class Polygon {
    /**
     * Construct a Polygon object
     *
     * @constructor
     * @param {Array} pts - The points of the Polygon object.
     */
    constructor(pts, attribs = {}) {
        this.pts = pts
        this.attribs = attribs
    }
}

export class Polyline {
    /**
     * Construct a Polyline object
     *
     * @constructor
     * @param {Array} pts - The points of the Polyline object.
     */
    constructor(pts, attribs = {}) {
        this.pts = pts
        this.attribs = attribs
    }
}

export class Rectangle {
    /**
     * Represents a Geo object.
     * @constructor
     * @param {Object} pos - The position of the Geo object.
     * @param {Object} size - The size of the Geo object.
     */
    constructor(pos, size, attribs = {}) {
        this.pos = pos
        this.size = size
        this.attribs = attribs
    }

    get pts() {
        const [x0, y0] = this.pos
        const [x1, y1] = this.max()
        return [
            [x0, y0],
            [x1, y0],
            [x1, y1],
            [x0, y1],
        ]
    }

    /**
     * Creates a new `Rect` object from a center point and size.
     *
     * @param {Array<number>} center - The center point of the rectangle.
     * @param {Array<number>} size - The size of the rectangle as an array of width and height.
     * @returns {Rect} A new `Rect` object.
     */
    static fromCenterPoint(center, size, attribs = {}) {
        const halfWidth = size[0] / 2
        const halfHeight = size[1] / 2
        const pos = [center[0] - halfWidth, center[1] - halfHeight]
        return new Rectangle(pos, size, attribs)
    }

    /**
     * Returns the maximum coordinates of the shape.
     * @returns {number[]} An array containing the maximum coordinates [x, y].
     */
    max() {
        return [this.pos[0] + this.size[0], this.pos[1] + this.size[1]]
    }

    //     static fromBounds(bounds) {
    //         const [topLeft, bottomRight] = bounds
    //         const pos = topLeft
    //         const size = [bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]]
    //         return new Rectangle(pos, size)
    //     }
    //     // === SPECIALIZED ===
    //     /**
    //      * Splits the rectangle into two smaller rectangles.
    //      * @param {number} t - The position of the split along the axis (0 to 1).
    //      * @param {boolean} [horizontal=true] - Indicates whether to perform a horizontal split (default) or a vertical split.
    //      * @returns {Array<Rect>} An array containing the two smaller rectangles resulting from the split.
    //      */
    //     split(t, horizontal = true) {
    //         if (horizontal) {
    //             // Horizontal split
    //             const y = this.pos[1] + this.size[1] * t // Calculate the split position along the y-axis
    //             return [
    //                 new Rectangle(this.pos, [this.size[0], y - this.pos[1]]), // Top rectangle
    //                 new Rectangle([this.pos[0], y], [this.size[0], this.size[1] - (y - this.pos[1])]), // Bottom rectangle
    //             ]
    //         } else {
    //             // Vertical split
    //             const x = this.pos[0] + this.size[0] * t // Calculate the split position along the x-axis
    //             return [
    //                 new Rectangle(this.pos, [x - this.pos[0], this.size[1]]), // Left rectangle
    //                 new Rectangle([x, this.pos[1]], [this.size[0] - (x - this.pos[0]), this.size[1]]), // Right rectangle
    //             ]
    //         }
    //     }
    //     /*
    //     inset(by) {
    //         return new Rect([this.pos[0] + by, this.pos[1] + by], [this.size[0] - 2 * by, this.size[1] - 2 * by])
    //     }
    //     enclosingCircle() {
    //         const centerX = this.pos[0] + this.size[0] / 2
    //         const centerY = this.pos[1] + this.size[1] / 2
    //         const radius = Math.hypot(this.size[0] / 2, this.size[1] / 2)
    //         return new Circle([centerX, centerY], radius)
    //     }
    //     enclosingSquare() {
    //         const centerX = this.pos[0] + this.size[0] / 2
    //         const centerY = this.pos[1] + this.size[1] / 2
    //         const side = Math.max(this.size[0], this.size[1])
    //         return new Rect([centerX - side / 2, centerY - side / 2], [side, side])
    //     }
    //     toLines() {
    //         throw new Error('Not implemented')
    //         // // convert position and size to cornver points
    //         // this.pts = [
    //         //     [this.pos[0], this.pos[1]], // Top-left corner
    //         //     [this.pos[0] + this.size[0], this.pos[1]], // Top-right corner
    //         //     [this.pos[0] + this.size[0], this.pos[1] + this.size[1]], // Bottom-right corner
    //         //     [this.pos[0], this.pos[1] + this.size[1]], // Bottom-left corner
    //         // ]
    //         // return [
    //         //     new Line(this.pts[0], this.pts[1]),
    //         //     new Line(this.pts[1], this.pts[2]),
    //         //     new Line(this.pts[2], this.pts[3]),
    //         //     new Line(this.pts[3], this.pts[0]),
    //         // ]
    //     }
    //     */
}
