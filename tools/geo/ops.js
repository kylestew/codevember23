import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rectangle, Ray } from './shapes'
import { random, randomPoint } from '../random'
import { neg, subN, mulN } from '../math/vectors'
import { wrapSides, partition } from '../array'

/*
export function operation(shape) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}
*/

/**
 * Computes the surface area of given `shape`.
 * For curves, lines, point clouds and rays the function returns 0.
 *
 * @param shape - shape to operate on
 */
export function area(shape) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        return Math.PI * shape.r * shape.r
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        return 0
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
        return 0
    } else if (shape instanceof Rectangle) {
        return shape.size[0] * shape.size[1]
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

/**
 * Converts a geometric object to a Path2D object.
 *
 * @param shape
 *
 * @returns {Path2D} - The converted Path2D object.
 * @throws {Error} - If the conversion method is not implemented for the given geometric object.
 */
export function asPath(shape) {
    let path = new Path2D()
    const typeName = shape.constructor.name

    switch (typeName) {
        case 'Arc': {
            const [x, y] = shape.pos
            path.arc(x, y, shape.r, shape.start, shape.end, shape.clockwise)
            break
        }

        case 'Ellipse':
            const [x, y] = shape.pos
            const [radX, radY] = shape.r
            path.ellipse(x, y, radX, radY, 0, 0, 2.0 * Math.PI)
            break

        case 'Polyline':
            shape.pts.forEach((pt, idx) => {
                const [x, y] = pt
                if (idx === 0) {
                    path.moveTo(x, y)
                } else {
                    path.lineTo(x, y)
                }
            })
            break

        case 'Circle': {
            const [x, y] = shape.pos
            path.arc(x, y, shape.r, 0, Math.PI * 2)
            break
        }

        case 'Line':
            path.moveTo(shape.pts[0][0], shape.pts[0][1])
            path.lineTo(shape.pts[1][0], shape.pts[1][1])
            break

        case 'Ray': {
            const [x, y] = shape.pos
            const [dx, dy] = shape.dir
            // Calculate a point far along the direction to simulate the "infinite" ray
            const length = 1000 // You can adjust this length as needed
            const endX = x + dx * length
            const endY = y + dy * length
            path.moveTo(x, y)
            path.lineTo(endX, endY)
            break
        }

        case 'Polygon':
            shape.pts.forEach((pt, idx) => {
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
            path.rect(shape.pos[0], shape.pos[1], shape.size[0], shape.size[1])
            break

        default:
            throw new Error(`Method not implemented on ${typeName}`)
    }
    return path
}

/**
 * Extracts/samples vertices from given shape's boundary and returns them as array.
 *
 * @example
 * ```ts
 * import { circle, vertices } from "@thi.ng/geom";
 *
 * // using default
 * asPoints(circle(100))
 *
 * // specify resolution only
 * asPoints(circle(100), 6)
 *
 * // specify more advanced options
 * asPoints(circle(100), { dist: 10 })
 * ```
 *
 * @param geo
 * @param num - number of vertices to sample (if not specified, uses default resolution per shape)
 */
export function asPoints(geo, num) {
    if (geo instanceof Arc) {
    } else if (geo instanceof Circle) {
        return resample(geo, num || 12).pts
    } else if (geo instanceof Ellipse) {
    } else if (geo instanceof Line || geo instanceof Polyline || geo instanceof Polygon || geo instanceof Rectangle) {
        if (num === undefined) {
            // just return the underlying points
            return geo.pts
        } else {
            return resample(geo, num).pts
        }
    }
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

/**
 * Converts given shape into an array of {@link Polygon}s, using provided `num` parameter
 * to determine the number of vertices for each polygon.
 *
 * @param shape
 * @param num
 */
export function asPolygon(shape, num) {
    if (shape instanceof Line || shape instanceof Polyline) {
        throw new Error(`Cannot convert ${shape.constructor.name} to Polygon`)
    }

    let pts = []
    if (shape instanceof Rectangle) {
        // for a rectangle I really just want to corner points
        pts = shape.points()
    } else {
        pts = asPoints(shape, num)
    }
    return new Polygon(pts, shape.attribs)
}

/**
 * Computes and returns bounding rect/box for the given shape.
 *
 * @param shape
 */
export function bounds(shape) {
    /* https://github.com/thi-ng/umbrella/blob/41bd769068da804eeace622ec7db50e4d48f1dc9/packages/geom/src/bounds.ts#L65 */
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        return new Rectangle(subN(shape.pos, shape.r), mulN([2, 2], shape.r))
    } else if (shape instanceof Ellipse) {
        const [cx, cy] = shape.pos
        const [rx, ry] = shape.r

        const minX = cx - rx
        const minY = cy - ry
        const maxX = cx + rx
        const maxY = cy + ry

        return new Rectangle([minX, minY], [maxX - minX, maxY - minY])
    } else if (shape instanceof Line) {
    } else if (shape instanceof Polygon) {
        const pts = shape.pts

        let minX = pts[0][0]
        let minY = pts[0][1]
        let maxX = pts[0][0]
        let maxY = pts[0][1]

        for (let i = 1; i < pts.length; i++) {
            let x = pts[i][0]
            let y = pts[i][1]

            if (x < minX) minX = x
            if (y < minY) minY = y
            if (x > maxX) maxX = x
            if (y > maxY) maxY = y
        }

        return new Rectangle([minX, minY], [maxX - minX, maxY - minY])
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        return new Rectangle(shape.pos, shape.size)
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

// export function center(geo) {
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

/**
 * Rotates a shape around its centroid by a given angle.
 * @param {Array} shape - The shape to be rotated.
 * @param {number} theta - The angle of rotation in radians.
 * @returns {Array} - The rotated shape.
 */
export function centerRotate(shape, theta) {
    const cent = centroid(shape)
    return translate(rotate(translate(shape, neg(cent)), theta), cent)
}

/**
 * Computes centroid (center point) of given shape
 *
 * @param shape
 */
export function centroid(shape) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        return shape.centerPT
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        return pointAt(shape, 0.5)
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        return [shape.pos[0] + shape.size[0] / 2, shape.pos[1] + shape.size[1] / 2]
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

/**
 * Extracts the edges of given shape's boundary and returns them as an iterable
 * of vector pairs.
 *
 * @param shape
 */
export function edges(shape) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        return partition(wrapSides(asPoints(shape), 0, 1), 2, 1)
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

// export function fitIntoBounds(geo) {
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

/**
 * Performs intersection tests on given 2 shapes and returns (???)
 *
 * @param a
 * @param b
 */
export function intersects(a, b) {
    if (a instanceof Ray && b instanceof Line) {
        const [rx, ry] = a.pos
        const [rdx, rdy] = a.dir
        const [x1, y1] = b.pts[0]
        const [x2, y2] = b.pts[1]

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

        throw new Error('This should be working for the given example')

        // No valid intersection
        return null
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

/**
 * Computes an offset shape (as in "path offsetting") of given shape and offset
 * distance `dist`.
 *
 * @param shape
 * @param dist
 */
export function offset(shape, dist) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        return new Circle(shape.pos, shape.r + dist, shape.attribs)
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        return Rectangle.withCenterAndInset(centroid(shape), shape.size, -dist, shape.attribs)
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

/**
 * Samples and returns point on the boundary of given 2D shape at normalized
 * parametric distance `t`. If the shape is closed, t=0 and t=1 yield the same
 * result.
 *
 * @param shape
 * @param t
 */
export function pointAt(shape, t) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        const theta = t * Math.PI * 2
        const x = Math.cos(theta) * shape.r + shape.pos[0]
        const y = Math.sin(theta) * shape.r + shape.pos[1]
        return [x, y]
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        const x = shape.pts[0][0] + t * (shape.pts[1][0] - shape.pts[0][0])
        const y = shape.pts[0][1] + t * (shape.pts[1][1] - shape.pts[0][1])
        return [x, y]
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

/**
 * Returns true if point `pt` is inside the given shape.
 *
 * @param shape
 * @param pt
 */
export function pointInside(shape, pt) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        const [x, y] = pt
        const [cx, cy] = shape.pos
        const r = shape.r

        return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2
    } else if (shape instanceof Ellipse) {
        const [x, y] = pt
        const [cx, cy] = shape.pos
        const [rx, ry] = shape.r

        // Check if the point lies within the ellipse using the standard ellipse equation
        return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1
    } else if (shape instanceof Line) {
    } else if (shape instanceof Polygon) {
        // raycasting algorithm
        const [x, y] = pt
        const pts = shape.pts

        var inside = false
        for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            var xi = pts[i][0],
                yi = pts[i][1]
            var xj = pts[j][0],
                yj = pts[j][1]

            var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
            if (intersect) inside = !inside
        }
        return inside
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        const [x, y] = pt
        const [x0, y0] = shape.pos
        const [x1, y1] = shape.max

        return x >= x0 && x <= x1 && y >= y0 && y <= y1
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

/**
 * Resamples given 2D shape with given options and returns result as polygon (if
 * closed) or polyline (if open).
 *
 * @param shape
 * @param num
 */
export function resample(shape, num) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        const pos = shape.pos
        const r = shape.r
        const delta = (Math.PI * 2.0) / num
        let pts = []
        for (let i = 0; i < num; i++) {
            pts.push([r * Math.cos(i * delta) + pos[0], r * Math.sin(i * delta) + pos[1]])
        }
        return new Polyline(pts, shape.attribs)
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        let pts = []
        for (let i = 0; i < num; i++) {
            const t = i / (num - 1)
            pts.push(pointAt(shape, t))
        }
        return new Polyline(pts, shape.attribs)
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

/**
 * Rotates given 2D shape by `theta` (in radians).
 *
 * @param shape
 * @param theta
 */
export function rotate(shape, theta) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        // Circles remain unchanged when rotated about their center.
        return new Circle(shape.center, shape.radius, shape.attribs)
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        // Rotating both endpoints of the line
        const [start, end] = shape.pts
        const newStart = [
            start[0] * Math.cos(theta) - start[1] * Math.sin(theta),
            start[0] * Math.sin(theta) + start[1] * Math.cos(theta),
        ]
        const newEnd = [
            end[0] * Math.cos(theta) - end[1] * Math.sin(theta),
            end[0] * Math.sin(theta) + end[1] * Math.cos(theta),
        ]
        return new Line(newStart, newEnd, shape.attribs)
    } else if (shape instanceof Polygon) {
        // rotate all points and make new polygon
        const newPts = shape.pts.map((pt) => [
            pt[0] * Math.cos(theta) - pt[1] * Math.sin(theta),
            pt[0] * Math.sin(theta) + pt[1] * Math.cos(theta),
        ])
        return new Polygon(newPts, shape.attribs)
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        // For a rectangle, rotate its corner points
        return rotate(new Polygon(asPoints(shape), shape.attribs), theta)
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

// + scale() - scale shape

/**
 * Produces `num` random points for which {@link pointInside} succeeds for the
 * given `shape`. Shape must implement `pointInside` and `bounds` methods.
 *
 * @param shape
 * @param num
 */
export function scatter(shape, num) {
    const b = bounds(shape)
    if (!b) return

    const mi = b.pos
    const mx = b.max

    let out = []
    while (num-- > 0) {
        while (true) {
            const p = randomPoint(mi, mx)
            if (pointInside(shape, p)) {
                out.push(p)
                break
            }
        }
    }
    return out
}

/**
 * Splits given shape in 2 parts at normalized parametric position `t`.
 *
 * @param shape
 * @param t
 */
export function splitAt(shape, t) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        const [a, b] = asPoints(shape)
        const splitPt = pointAt(shape, t)
        return [new Line(a, splitPt, shape.attribs), new Line(splitPt, b, shape.attribs)]
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

// /**
//  * Splits given shape in 2 parts at normalized parametric position `t`.
//  * Meant for line-like objects
//  *
//  * @param shape
//  * @param t
//  */
// export function splitAt(geo, t) {
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

// + transform() - apply transformation matrix

/**
 * Translates given shape by given `offset` vector.
 *
 * @param shape
 * @param offset - [x, y] offset vector
 */
export function translate(shape, offset) {
    if (!Array.isArray(offset) || offset.length !== 2) {
        throw new Error('Offset must be a 2D vector')
    }

    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        const newPts = asPoints(shape).map((pt) => [pt[0] + offset[0], pt[1] + offset[1]])
        return new Line(newPts[0], newPts[1], shape.attribs)
    } else if (shape instanceof Polygon) {
        // move all points
        const newPts = asPoints(shape).map((pt) => [pt[0] + offset[0], pt[1] + offset[1]])
        return new Polygon(newPts, shape.attribs)
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        return new Rectangle([shape.pos[0] + offset[0], shape.pos[1] + offset[1]], shape.size, shape.attribs)
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

export function withAttribs(shape, attribs) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
        return new Circle(shape.pos, shape.r, attribs)
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
        return new Line(shape.pts, attribs)
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        return new Rectangle(shape.pos, shape.size, attribs)
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}
