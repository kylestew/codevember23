import { Rectangle, Polygon } from './shapes.js'

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

export class Grid {
    constructor(pos, size, rows, cols) {
        this.pos = pos
        this.size = size
        this.rows = rows
        this.cols = cols
    }

    get cellSize() {
        return [this.size[0] / this.cols, this.size[1] / this.rows]
    }

    rects() {
        let [cellWidth, cellHeight] = this.cellSize

        let grid = []
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                grid.push(this.#generateCell(i, j, cellWidth, cellHeight))
            }
        }
        return grid
    }

    triangles() {
        let triangles = []
        let [cellWidth, cellHeight] = this.cellSize

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let [x, y] = [this.pos[0] + j * cellWidth, this.pos[1] + i * cellHeight]

                // Define two triangles within each cell
                let tri1 = new Polygon([
                    [x, y],
                    [x + cellWidth, y],
                    [x, y + cellHeight],
                ])
                let tri2 = new Polygon([
                    [x + cellWidth, y],
                    [x + cellWidth, y + cellHeight],
                    [x, y + cellHeight],
                ])

                triangles.push(tri1, tri2)
            }
        }
        return triangles
    }

    staggeredTriangles() {
        let triangles = []
        let [cellWidth, cellHeight] = this.cellSize
        let halfWidth = cellWidth / 2
        let halfHeight = cellHeight / 2

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let baseX = this.pos[0] + j * halfWidth
                let baseY = this.pos[1] + i * cellHeight

                if ((i + j) % 2 === 0) {
                    // Triangle pointing upwards
                    let tri = new Polygon([
                        [baseX, baseY + cellHeight],
                        [baseX + halfWidth, baseY],
                        [baseX + cellWidth, baseY + cellHeight],
                    ])
                    triangles.push(tri)
                } else {
                    // Triangle pointing downwards
                    let tri = new Polygon([
                        [baseX, baseY],
                        [baseX + halfWidth, baseY + cellHeight],
                        [baseX + cellWidth, baseY],
                    ])
                    triangles.push(tri)
                }
            }
        }
        return triangles
    }

    #generateCell(row, col, cellWidth, cellHeight) {
        let x = this.pos[0] + col * cellWidth
        let y = this.pos[1] + row * cellHeight
        return new Rectangle([x, y], [cellWidth, cellHeight])
    }
}

/*

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

//     import { Vec } from '@thi.ng/vectors'
// import { iterator, trace, comp, map, push, flatten1, partition } from '@thi.ng/transducers'
// import { line, splitAt } from '@thi.ng/geom'
