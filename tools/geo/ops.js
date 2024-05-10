import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rectangle } from './shapes'
import { random, randomPoint } from '../random'

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
        return Math.PI * shape.radius * shape.radius
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

        // case 'Ellipse':
        // case 'Polyline':

        case 'Circle': {
            const [x, y] = shape.pos
            path.arc(x, y, shape.r, 0, Math.PI * 2)
            break
        }

        case 'Line':
            path.moveTo(shape.pts[0][0], shape.pts[0][1])
            path.lineTo(shape.pts[1][0], shape.pts[1][1])
            break

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

// export function asPolygon(geo) {
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

/**
 * Computes and returns bounding rect/box for the given shape.
 *
 * @param shape
 */
export function bounds(shape) {
    /* https://github.com/thi-ng/umbrella/blob/41bd769068da804eeace622ec7db50e4d48f1dc9/packages/geom/src/bounds.ts#L65 */
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        return new Rectangle(shape.pos, shape.size, shape.attribs)
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

// export function center(geo) {
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

// /**
//  * Computes centroid of given shape
//  *
//  * @param geo
//  */
// export function centroid(geo) {
//     if (geo instanceof Arc) {
//     } else if (geo instanceof Circle) {
//         return geo.centerPT
//     } else if (geo instanceof Ellipse) {
//     } else if (geo instanceof Line) {
//     } else if (geo instanceof Polygon) {
//     } else if (geo instanceof Polyline) {
//     } else if (geo instanceof Rectangle) {
//         return [geo.pos[0] + geo.size[0] / 2, geo.pos[1] + geo.size[1] / 2]
//     }
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

// // export function edges(geo) {
// //     if (geo instanceof Rect) {
// //         return geo.toLines()
// //     } else {
// //         throw new Error(`Method not implemented on ${geo.constructor.name}`)
// //     }
// // }

// export function fitIntoBounds(geo) {
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

// /**
//  * Computes an offset shape (as in "path offsetting") of given shape and offset
//  * distance `dist`.
//  *
//  * @param geo
//  * @param dist
//  */
// export function offset(geo, dist) {
//     throw new Error(`Method not implemented on ${geo.constructor.name}`)
// }

// export function pointAt(geo, t) {
//     if (geo instanceof Line) {
//         //     const x = this.pts[0][0] + t * (this.pts[1][0] - this.pts[0][0])
//         //     const y = this.pts[0][1] + t * (this.pts[1][1] - this.pts[0][1])
//         //     return [x, y]
//     } else if (geo instanceof Circle) {
//         //     const theta = t * Math.PI * 2
//         //     const x = Math.cos(theta) * this.radius + this.centerPT[0]
//         //     const y = Math.sin(theta) * this.radius + this.centerPT[1]
//         //     return [x, y]
//     } else {
//         throw new Error(`Method not implemented on ${geo.constructor.name}`)
//     }
// }

/**
 * Returns true if point `pt` is inside the given shape.
 *
 * @param shape
 * @param pt
 */
export function pointInside(shape, pt) {
    if (shape instanceof Arc) {
    } else if (shape instanceof Circle) {
    } else if (shape instanceof Ellipse) {
    } else if (shape instanceof Line) {
    } else if (shape instanceof Polygon) {
    } else if (shape instanceof Polyline) {
    } else if (shape instanceof Rectangle) {
        const [x, y] = pt
        const [x0, y0] = shape.pos
        const [x1, y1] = shape.max()

        return x >= x0 && x <= x1 && y >= y0 && y <= y1
    }
    throw new Error(`Method not implemented on ${shape.constructor.name}`)
}

// + resample() - resample/convert shape
// + rotate() - rotate shape
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
    const mx = b.max()

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

// // + splitAt() - split shape/boundary at parametric position

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
// + translate() - translate shape

/**
 * Extracts/samples vertices from given shape's boundary and returns them as
 * array.
 *
 * @example
 * ```ts
 * import { circle, vertices } from "@thi.ng/geom";
 *
 * // using default
 * vertices(circle(100))
 *
 * // specify resolution only
 * vertices(circle(100), 6)
 *
 * // specify more advanced options
 * vertices(circle(100), { dist: 10 })
 * ```
 *
 * @param geo
 * @param opts
 */
export function vertices(geo, num) {
    if (geo instanceof Arc) {
    } else if (geo instanceof Circle) {
        const pos = geo.pos
        const r = geo.r
        const delta = (Math.PI * 2.0) / num
        let xys = []
        for (let i = 0; i < num; i++) {
            xys.push([r * Math.cos(i * delta) + pos[0], r * Math.sin(i * delta) + pos[1]])
        }
        return xys
    } else if (geo instanceof Ellipse) {
    } else if (geo instanceof Line) {
    } else if (geo instanceof Polygon) {
    } else if (geo instanceof Polyline) {
    } else if (geo instanceof Rectangle) {
    }
    throw new Error(`Method not implemented on ${geo.constructor.name}`)
}

// // randomPointIn() {
// //     const x = random(this.pos[0], this.pos[0] + this.size[0])
// //     const y = random(this.pos[1], this.pos[1] + this.size[1])
// //     return [x, y]
// // }

// // /// t = [0, 1]
// // pointAt(t) {
// //     const theta = t * Math.PI * 2
// //     const x = Math.cos(theta) * this.radius + this.centerPT[0]
// //     const y = Math.sin(theta) * this.radius + this.centerPT[1]
// //     return [x, y]
// // }

// // pointAt(t) {
// //     const x = this.pts[0][0] + t * (this.pts[1][0] - this.pts[0][0])
// //     const y = this.pts[0][1] + t * (this.pts[1][1] - this.pts[0][1])
// //     return [x, y]
// // }

// // randomPointIn() {
// //     const x = random(this.pos[0], this.pos[0] + this.size[0])
// //     const y = random(this.pos[1], this.pos[1] + this.size[1])
// //     return [x, y]
// // }
