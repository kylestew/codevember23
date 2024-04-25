import { rotateLeft, chunkArray } from '../util/util.js'
import { random } from '../tools/random.js'

export class Line {
    constructor(start, end) {
        this.pts = [start, end] // Store start and end points as an array
    }

    static fromPointAngleLength(pt, angle, length) {
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)
        const halfLength = length / 2

        const startPoint = [pt[0] - dx * halfLength, pt[1] - dy * halfLength]
        const endPoint = [pt[0] + dx * halfLength, pt[1] + dy * halfLength]

        return new Line(startPoint, endPoint)
    }

    length() {
        const dx = this.pts[1].x - this.pts[0].x
        const dy = this.pts[1].y - this.pts[0].y
        return Math.sqrt(dx * dx + dy * dy)
    }

    pointAt(t) {
        const x = this.pts[0][0] + t * (this.pts[1][0] - this.pts[0][0])
        const y = this.pts[0][1] + t * (this.pts[1][1] - this.pts[0][1])
        return [x, y]
    }

    path() {
        let path = new Path2D()
        path.moveTo(this.pts[0][0], this.pts[0][1])
        path.lineTo(this.pts[1][0], this.pts[1][1])
        return path
    }
}

export class Rect {
    constructor(pos, size) {
        this.pos = pos
        this.size = size
    }

    static fromBounds(bounds) {
        const [topLeft, bottomRight] = bounds
        const pos = topLeft
        const size = [bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]]
        return new Rect(pos, size)
    }

    area() {
        return this.size[0] * this.size[1]
    }

    split(t, horizontal = true) {
        if (horizontal) {
            // Horizontal split
            const y = this.pos[1] + this.size[1] * t // Calculate the split position along the y-axis
            return [
                new Rect(this.pos, [this.size[0], y - this.pos[1]]), // Top rectangle
                new Rect([this.pos[0], y], [this.size[0], this.size[1] - (y - this.pos[1])]), // Bottom rectangle
            ]
        } else {
            // Vertical split
            const x = this.pos[0] + this.size[0] * t // Calculate the split position along the x-axis
            return [
                new Rect(this.pos, [x - this.pos[0], this.size[1]]), // Left rectangle
                new Rect([x, this.pos[1]], [this.size[0] - (x - this.pos[0]), this.size[1]]), // Right rectangle
            ]
        }
    }

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

    path() {
        let path = new Path2D()
        path.rect(this.pos[0], this.pos[1], this.size[0], this.size[1])
        return path
    }
}

export class Circle {
    constructor(centerPT, radius) {
        this.centerPT = centerPT
        this.radius = radius
    }

    bounds() {
        const [x, y] = this.centerPT
        return [
            [x - this.radius, y - this.radius],
            [x + this.radius, y + this.radius],
        ]
    }

    area() {
        return Math.PI * this.radius * this.radius
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

    randomPointIn() {
        const [x, y] = this.centerPT

        // don't get stuck if none found
        for (let i = 0; i < 100; i++) {
            // throw for random in rect containing circle
            let rx = random(x - this.radius, x + this.radius)
            let ry = random(y - this.radius, y + this.radius)

            // is it in circle
            if (this.#distanceFromCenter(x, y, rx, ry) <= this.radius) {
                return [rx, ry]
            }
        }
        return pt
    }

    /// t = [0, 1]
    pointAt(t) {
        const theta = t * Math.PI * 2
        const x = Math.cos(theta) * this.radius + this.centerPT[0]
        const y = Math.sin(theta) * this.radius + this.centerPT[1]
        return [x, y]
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

    path() {
        const [x, y] = this.centerPT
        let path = new Path2D()
        path.arc(x, y, this.radius, 0, Math.PI * 2)
        return path
    }
}

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

export class Polygon {
    constructor(pts) {
        this.pts = pts
    }

    path() {
        let path = new Path2D()
        this.pts.forEach((pt, idx) => {
            const [x, y] = pt
            if (idx == 0) {
                path.moveTo(x, y)
            } else {
                path.lineTo(x, y)
            }
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
