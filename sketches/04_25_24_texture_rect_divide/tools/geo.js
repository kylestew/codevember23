import { rotateLeft, chunkArray } from '../util/util.js'
import { random } from './random.js'

/*
https://github.com/thi-ng/umbrella/tree/develop/packages/geom

Types:
(Point: Array [x, y])
+ Arc
+ Circle
+ (Cubic)
+ Ellipse
+ (Group)
+ Line
+ Polygon
+ Polyline
+ Rectangle

Operations:
+ area()
+ asPath() - convert shape to Path2D
+ asPolygon()
+ bounds()
+ center() - center shape around origin or point
+ centroid() - computer shape centroid
+ edges() - extract edges
+ fitIntoBounds() - rescale/reposition shapes into a destination boundary
+ offset() - shape/path offsetting
+ pointAt() - compute point on shape boundary at parametric position
+ pointInside() - check if point inside shape 
+ resample() - resample/convert shape
+ rotate() - rotate shape
+ scale() - scale shape
+ scatter() - create random points inside a shape boundary
+ splitAt() - split shape/boundary at parametric position
+ transform() - apply transformation matrix
+ translate() - translate shape
+ vertices() - extract/sample vertices from shape boundary
*/

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
    constructor(pos, r, start, end, clockwise = false) {
        this.pos = pos
        this.r = r
        this.start = start
        this.end = end
        this.clockwise = clockwise
        this.info = {}
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
    constructor(pos, r) {
        this.pos = pos
        this.r = r
        this.info = {}
    }

    /*
    bounds() {
        const [x, y] = this.centerPT
        return [
            [x - this.r, y - this.r],
            [x + this.r, y + this.r],
        ]
    }

    blobbyBeziers(perturbation = 10) {
        // find lines representing the bounding box of the circle
        const lines = Rect.fromBounds(this.bounds()).toLines()

        // map this lines into control points to form a full circle replacement
        let pts = lines.flatMap((line) => {
            // new line with perturbation - based on original circle control points
            const pt0 = randomInCircle(line.pointAt(0.25), perturbation)
            const pt1 = randomInCircle(line.pointAt(0.75), perturbation)
            const newLine = new Line(pt0, pt1)

            return [pt0, newLine.pointAt(random(0.4, 0.6)), pt1]
        })

        // rotate array so two points are in last group
        pts = rotateLeft(pts)
        const firstPoint = pts[0]
        pts = rotateLeft(pts)
        // chunk up into groups
        const controls = chunkArray(pts, 3)
        // new we can create the Beziers object
        return new Beziers(firstPoint, controls)
    }

    #distanceFromCenter(centerX, centerY, pointX, pointY) {
        const dx = pointX - centerX
        const dy = pointY - centerY
        return Math.sqrt(dx * dx + dy * dy)
    }

    // TODO: toPoints or toPolygon function

    degradedPoly(degradation = 0.3) {
        const [x, y] = this.centerPT
        const r = this.radius

        // sweep around circle unevenly
        let pts = []
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16.0 + random(0, degradation)) {
            const radius = r + r * random(-degradation, degradation)
            // const radius = r
            const pt = [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius]
            pts.push(pt)
        }
        return new Polygon(pts)
    }
    */
}

export class Ellipse {}

export class Line {
    constructor(start, end) {
        this.pts = [start, end] // Store start and end points as an array
    }

    static fromMidpointAndAngle(pt, angle, length) {
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)
        const halfLength = length / 2

        const startPoint = [pt[0] - dx * halfLength, pt[1] - dy * halfLength]
        const endPoint = [pt[0] + dx * halfLength, pt[1] + dy * halfLength]

        return new Line(startPoint, endPoint)
    }

    // length() {
    //     const dx = this.pts[1].x - this.pts[0].x
    //     const dy = this.pts[1].y - this.pts[0].y
    //     return Math.sqrt(dx * dx + dy * dy)
    // }
}

export class Polygon {
    /**
     * Construct a Polygon object
     *
     * @constructor
     * @param {Array} pts - The points of the Polygon object.
     */
    constructor(pts) {
        this.pts = pts
    }
}

export class Polyline {}

export class Rectangle {
    /**
     * Represents a Geo object.
     * @constructor
     * @param {Object} pos - The position of the Geo object.
     * @param {Object} size - The size of the Geo object.
     */
    constructor(pos, size) {
        this.pos = pos
        this.size = size
        this.info = {}
    }

    /**
     * Creates a new `Rect` object from a center point and size.
     *
     * @param {Array<number>} center - The center point of the rectangle.
     * @param {Array<number>} size - The size of the rectangle as an array of width and height.
     * @returns {Rect} A new `Rect` object.
     */
    static fromCenterPoint(center, size) {
        const halfWidth = size[0] / 2
        const halfHeight = size[1] / 2
        const pos = [center[0] - halfWidth, center[1] - halfHeight]
        return new Rectangle(pos, size)
    }

    static fromBounds(bounds) {
        const [topLeft, bottomRight] = bounds
        const pos = topLeft
        const size = [bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]]
        return new Rectangle(pos, size)
    }

    // === SPECIALIZED ===

    /**
     * Splits the rectangle into two smaller rectangles.
     * @param {number} t - The position of the split along the axis (0 to 1).
     * @param {boolean} [horizontal=true] - Indicates whether to perform a horizontal split (default) or a vertical split.
     * @returns {Array<Rect>} An array containing the two smaller rectangles resulting from the split.
     */
    split(t, horizontal = true) {
        if (horizontal) {
            // Horizontal split
            const y = this.pos[1] + this.size[1] * t // Calculate the split position along the y-axis
            return [
                new Rectangle(this.pos, [this.size[0], y - this.pos[1]]), // Top rectangle
                new Rectangle([this.pos[0], y], [this.size[0], this.size[1] - (y - this.pos[1])]), // Bottom rectangle
            ]
        } else {
            // Vertical split
            const x = this.pos[0] + this.size[0] * t // Calculate the split position along the x-axis
            return [
                new Rectangle(this.pos, [x - this.pos[0], this.size[1]]), // Left rectangle
                new Rectangle([x, this.pos[1]], [this.size[0] - (x - this.pos[0]), this.size[1]]), // Right rectangle
            ]
        }
    }

    /*
    inset(by) {
        return new Rect([this.pos[0] + by, this.pos[1] + by], [this.size[0] - 2 * by, this.size[1] - 2 * by])
    }

    enclosingCircle() {
        const centerX = this.pos[0] + this.size[0] / 2
        const centerY = this.pos[1] + this.size[1] / 2
        const radius = Math.hypot(this.size[0] / 2, this.size[1] / 2)
        return new Circle([centerX, centerY], radius)
    }

    enclosingSquare() {
        const centerX = this.pos[0] + this.size[0] / 2
        const centerY = this.pos[1] + this.size[1] / 2
        const side = Math.max(this.size[0], this.size[1])
        return new Rect([centerX - side / 2, centerY - side / 2], [side, side])
    }

    toLines() {
        throw new Error('Not implemented')
        // // convert position and size to cornver points
        // this.pts = [
        //     [this.pos[0], this.pos[1]], // Top-left corner
        //     [this.pos[0] + this.size[0], this.pos[1]], // Top-right corner
        //     [this.pos[0] + this.size[0], this.pos[1] + this.size[1]], // Bottom-right corner
        //     [this.pos[0], this.pos[1] + this.size[1]], // Bottom-left corner
        // ]
        // return [
        //     new Line(this.pts[0], this.pts[1]),
        //     new Line(this.pts[1], this.pts[2]),
        //     new Line(this.pts[2], this.pts[3]),
        //     new Line(this.pts[3], this.pts[0]),
        // ]
    }

    randomPointIn() {
        const x = random(this.pos[0], this.pos[0] + this.size[0])
        const y = random(this.pos[1], this.pos[1] + this.size[1])
        return [x, y]
    }
    */
}

// == SPECIAL ================
export class Beziers {
    /// pts loaded in need to be in groups of 3 and represent the control
    /// handles for the beziers
    constructor(startPt, controls) {
        this.startPt = startPt
        this.controls = controls
    }

    path() {
        let path = new Path2D()
        path.moveTo(this.startPt[0], this.startPt[1])
        this.controls.forEach(([ctrlPt1, ctrlPt2, anchorPt]) => {
            path.bezierCurveTo(ctrlPt1[0], ctrlPt1[1], ctrlPt2[0], ctrlPt2[1], anchorPt[0], anchorPt[1])
        })
        path.closePath()
        return path
    }
}

export class Grid {
    constructor(pos, size) {
        this.pos = pos
        this.size = size

        // convert position and size to cornver points
        this.pts = [
            [this.pos[0], this.pos[1]], // Top-left corner
            [this.pos[0] + this.size[0], this.pos[1]], // Top-right corner
            [this.pos[0] + this.size[0], this.pos[1] + this.size[1]], // Bottom-right corner
            [this.pos[0], this.pos[1] + this.size[1]], // Bottom-left corner
        ]
    }

    static fromRect(bounds) {
        const [topLeft, bottomRight] = bounds
        const pos = topLeft
        const size = [bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]]
        return new Rect(pos, size)
    }

    area() {
        return this.size[0] * this.size[1]
    }

    path() {
        let path = new Path2D()
        path.rect(this.pos[0], this.pos[1], this.size[0], this.size[1])
        return path
    }
}
// ===========================

/*
export function operation(geo) {
    if (geo instanceof Arc) {
    } else if (geo instanceof Circle) {
    } else if (geo instanceof Ellipse) {
    } else if (geo instanceof Line) {
    } else if (geo instanceof Polygon) {
    } else if (geo instanceof Polyline) {
    } else if (geo instanceof Rectangle) {
    }
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}
*/

/**
 * Computes the surface area of given `shape`.
 * For curves, lines, point clouds and rays the function returns 0.
 *
 * @param geo - shape to operate on
 */
export function area(geo) {
    if (geo instanceof Arc) {
    } else if (geo instanceof Circle) {
        return Math.PI * geo.radius * geo.radius
    } else if (geo instanceof Ellipse) {
    } else if (geo instanceof Line) {
        return 0
    } else if (geo instanceof Polygon) {
    } else if (geo instanceof Polyline) {
        return 0
    } else if (geo instanceof Rectangle) {
        return geo.size[0] * geo.size[1]
    }
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

/**
 * Converts a geometric object to a Path2D object.
 *
 * @param {Object} geo - The geometric object to convert.
 *
 * @returns {Path2D} - The converted Path2D object.
 * @throws {Error} - If the conversion method is not implemented for the given geometric object.
 */
export function asPath(geo) {
    let path = new Path2D()
    const typeName = geo.constructor.name

    switch (typeName) {
        case 'Arc': {
            const [x, y] = geo.pos
            path.arc(x, y, geo.r, geo.start, geo.end, geo.clockwise)
            break
        }

        // case 'Ellipse':
        // case 'Polyline':

        case 'Circle': {
            const [x, y] = geo.pos
            path.arc(x, y, geo.r, 0, Math.PI * 2)
            break
        }

        case 'Line':
            path.moveTo(geo.pts[0][0], geo.pts[0][1])
            path.lineTo(geo.pts[1][0], geo.pts[1][1])
            break

        case 'Polygon':
            geo.pts.forEach((pt, idx) => {
                const [x, y] = pt
                if (idx === 0) {
                    path.moveTo(x, y)
                } else {
                    path.lineTo(x, y)
                }
            })
            path.closePath()
            break

        case 'Rectangle':
            path.rect(geo.pos[0], geo.pos[1], geo.size[0], geo.size[1])
            break

        default:
            throw new Error(`Method not implemented on ${typeName}`)
    }
    return path
}

export function asPolygon(geo) {
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

export function bounds(geo) {
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

export function center(geo) {
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

/**
 * Computes centroid of given shape
 *
 * @param geo
 */
export function centroid(geo) {
    if (geo instanceof Arc) {
    } else if (geo instanceof Circle) {
        return geo.centerPT
    } else if (geo instanceof Ellipse) {
    } else if (geo instanceof Line) {
    } else if (geo instanceof Polygon) {
    } else if (geo instanceof Polyline) {
    } else if (geo instanceof Rectangle) {
        return [geo.pos[0] + geo.size[0] / 2, geo.pos[1] + geo.size[1] / 2]
    }
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

// export function edges(geo) {
//     if (geo instanceof Rect) {
//         return geo.toLines()
//     } else {
//         throw new Error(`Method not implemented on ${geo.constructor.name}`)
//     }
// }

export function fitIntoBounds(geo) {
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

/**
 * Computes an offset shape (as in "path offsetting") of given shape and offset
 * distance `dist`.
 *
 * @param geo
 * @param dist
 */
export function offset(geo, dist) {
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

export function pointAt(geo, t) {
    if (geo instanceof Line) {
        //     const x = this.pts[0][0] + t * (this.pts[1][0] - this.pts[0][0])
        //     const y = this.pts[0][1] + t * (this.pts[1][1] - this.pts[0][1])
        //     return [x, y]
    } else if (geo instanceof Circle) {
        //     const theta = t * Math.PI * 2
        //     const x = Math.cos(theta) * this.radius + this.centerPT[0]
        //     const y = Math.sin(theta) * this.radius + this.centerPT[1]
        //     return [x, y]
    } else {
        throw new Error(`Method not implemented on ${geo.constructor.name}`)
    }
}

// + pointInside() - check if point inside shape
// + resample() - resample/convert shape
// + rotate() - rotate shape
// + scale() - scale shape
// + scatter() - create random points inside a shape boundary
// + splitAt() - split shape/boundary at parametric position

/**
 * Splits given shape in 2 parts at normalized parametric position `t`.
 * Meant for line-like objects
 *
 * @param shape
 * @param t
 */
export function splitAt(geo, t) {
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

// + transform() - apply transformation matrix
// + translate() - translate shape
// + vertices() - extract/sample vertices from shape boundary

// randomPointIn() {
//     const x = random(this.pos[0], this.pos[0] + this.size[0])
//     const y = random(this.pos[1], this.pos[1] + this.size[1])
//     return [x, y]
// }

// /// t = [0, 1]
// pointAt(t) {
//     const theta = t * Math.PI * 2
//     const x = Math.cos(theta) * this.radius + this.centerPT[0]
//     const y = Math.sin(theta) * this.radius + this.centerPT[1]
//     return [x, y]
// }

// pointAt(t) {
//     const x = this.pts[0][0] + t * (this.pts[1][0] - this.pts[0][0])
//     const y = this.pts[0][1] + t * (this.pts[1][1] - this.pts[0][1])
//     return [x, y]
// }

// randomPointIn() {
//     const x = random(this.pos[0], this.pos[0] + this.size[0])
//     const y = random(this.pos[1], this.pos[1] + this.size[1])
//     return [x, y]
// }
