import { adaptiveCanvas2d } from '@thi.ng/canvas'
import { Sketch, SketchParams } from './types'
import tinycolor from 'tinycolor2'
import { draw } from '@thi.ng/hiccup-canvas'
import { circle, Polygon, asPolygon, points, edges, line, arcLength, Line, pointAt, polygon } from '@thi.ng/geom'
import { transduce, comp, push, trace, map, mapcat, flatten1 } from '@thi.ng/transducers'
import { Vec, vec2, Vec2, VecPair, perpendicularCW, mag, normalize, add, mulN, rotate } from '@thi.ng/vectors'
import { SYSTEM, gaussian } from '@thi.ng/random'
import { clamp01 } from '@thi.ng/math'

function asVec2(p: VecPair): Vec2 {
    return vec2(p[1][0] - p[0][0], p[1][1] - p[0][1])
}

export class MySketch extends Sketch {
    private ctx: CanvasRenderingContext2D
    private width: number = 640
    private height: number = 480

    private shapes: Polygon[] = []
    private shapeGen: Generator<Polygon> = this.makeShape()

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, 100)

        const dpr = window.devicePixelRatio || 1
        const { ctx } = adaptiveCanvas2d(this.width, this.height, appElm)
        this.ctx = ctx

        // scale canvas so shortest side is in range [-1, 1]
        if (this.width > this.height) {
            const scale = (this.height / 2.0) * dpr
            this.ctx.scale(scale, scale)
            this.ctx.translate((this.width * 0.5 * dpr) / scale, 1.0)
        } else {
            const scale = (this.width / 2.0) * dpr
            this.ctx.scale(scale, scale)
            this.ctx.translate(1.0, (this.height * 0.5 * dpr) / scale)
        }
    }

    setup() {
        this.shapes = []
    }

    *makeShape(): Generator<Polygon> {
        // TODO: make more organic shapes
        const r = 0.5
        yield asPolygon(
            circle([0, 0], r, { fill: tinycolor(this.params.tint).toRgbString() }), //
            10
        )
    }

    randomEdgeBreak = () => {
        // gaussian ditro centered around 0.5 with a scale of 2
        const gauss = gaussian(SYSTEM, 24, 0.5, 2.0)
        return clamp01(gauss())
    }
    randomAngle = () => {
        return gaussian(SYSTEM, 24, 0.0, Math.PI)()
    }
    randomLength = (edgeLength: number) => {
        return Math.abs(gaussian(SYSTEM, 24, 0.0, 2.0)()) * edgeLength
    }

    iterateCoastline(poly: Polygon): Polygon {
        const points = transduce(
            comp(
                map((edge) => {
                    // cut the edge at some point near the middle
                    const breakPt = pointAt(line(edge), randomEdgeBreak())!
                    // determine vector perpendicular to edge
                    const vecAB = asVec2(edge)
                    let perp = perpendicularCW([], vecAB)
                    const length = mag(vecAB)
                    // adjust the angle a random amount
                    rotate(perp, perp, randomAngle())
                    // project the break point outwards
                    const proj = mulN([], normalize(null, perp), randomLength(length))
                    const pt = add([], breakPt, proj)

                    // return new edge (2nd edge is defined by end of this edge and start of next)
                    return [edge[0] as Vec, pt]
                }),
                flatten1()
                // trace()
            ),
            push<Vec>(),
            edges(poly)
        )
        return polygon(points, poly.attribs)
    }

    update(iteration: number): number {
        // TODO: create the points yourself
        const shape = this.shapeGen.next().value

        // assign base probabilities
        const edgeware = [
            ...map((edge: VecPair) => {
                edge.attr = { abc: 123 }
                return edge
            }, edges(shape)),
        ]
        const newShape = polygon(edgeware)
        console.log(newShape)

        // const edge0 = [...edges(shape)][0]
        // console.log(edge0)
        // console.log(...edges(shape))
        //...

        // create a base subdivided poly
        // let poly = this.oneRound(shape)
        // poly = this.oneRound(poly)
        // poly = this.oneRound(poly)
        // const baseShape = this.oneRound(poly)

        // Create 50 version of this subdivided 3 more times
        // for (let i = 0; i < 100; i++) {
        //     let newPoly = this.oneRound(baseShape)
        //     newPoly = this.oneRound(baseShape)
        //     newPoly = this.oneRound(baseShape)
        //     this.shapes.push(newPoly)
        // TODO: push the color with a opacity scaled to # of iterations
        // }

        // this.shapes.push(poly)

        this.stop()
        return iteration
    }

    render() {
        const bgColor = tinycolor(this.params.background)
        draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])
        // TODO: draw with masking for texture
    }
}
