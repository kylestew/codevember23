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
