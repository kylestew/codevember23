import { random } from './util/util.js'
import { rotateLeft, chunkArray } from './util/util.js'

export class Line {
    constructor(start, end) {
        this.pts = [start, end] // Store start and end points as an array
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

    outputPath(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.pts[0][0], this.pts[0][1])
        ctx.lineTo(this.pts[1][0], this.pts[1][1])
    }
}

export class Rect {
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

    static fromBounds(bounds) {
        const [topLeft, bottomRight] = bounds
        const pos = topLeft
        const size = [bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]]
        return new Rect(pos, size)
    }

    toLines() {
        return [
            new Line(this.pts[0], this.pts[1]),
            new Line(this.pts[1], this.pts[2]),
            new Line(this.pts[2], this.pts[3]),
            new Line(this.pts[3], this.pts[0]),
        ]
    }

    outputPath(ctx) {
        ctx.beginPath()
        this.pts.forEach((pt, idx) => {
            const [x, y] = pt
            if (idx == 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })
        ctx.closePath()
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

    outputPath(ctx) {
        const [x, y] = this.centerPT

        ctx.beginPath()
        ctx.arc(x, y, this.radius, 0, Math.PI * 2)
    }
}

export class Beziers {
    /// pts loaded in need to be in groups of 3 and represent the control
    /// handles for the beziers
    constructor(startPt, controls) {
        this.startPt = startPt
        this.controls = controls
    }

    outputPath(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.startPt[0], this.startPt[1])
        this.controls.forEach(([ctrlPt1, ctrlPt2, anchorPt]) => {
            ctx.bezierCurveTo(ctrlPt1[0], ctrlPt1[1], ctrlPt2[0], ctrlPt2[1], anchorPt[0], anchorPt[1])
        })
        ctx.closePath()
    }
}

export class Polygon {
    constructor(pts) {
        this.pts = pts
    }

    outputPath(ctx) {
        ctx.beginPath()
        this.pts.forEach((pt, idx) => {
            const [x, y] = pt
            if (idx == 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })
        ctx.closePath()
    }
}

export function randomInCircle(pt, rad) {
    const [x, y] = pt

    // don't get stuck if none found
    for (let i = 0; i < 100; i++) {
        // throw for random in rect containing circle
        let rx = random(x - rad, x + rad)
        let ry = random(y - rad, y + rad)

        // is it in circle
        if (distanceFromCenter(x, y, rx, ry) <= rad) {
            return [rx, ry]
        }
    }
    return pt
}

function distanceFromCenter(centerX, centerY, pointX, pointY) {
    const dx = pointX - centerX
    const dy = pointY - centerY
    return Math.sqrt(dx * dx + dy * dy)
}
