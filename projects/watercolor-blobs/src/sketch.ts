import { adaptiveCanvas2d } from '@thi.ng/canvas'
import { Sketch, SketchParams } from './types'
import tinycolor from 'tinycolor2'
import { draw } from '@thi.ng/hiccup-canvas'
import { circle, Polygon, asPolygon, points, edges, line, arcLength, Line, pointAt, polygon } from '@thi.ng/geom'
import { transduce, comp, push, trace, map, mapcat, flatten1 } from '@thi.ng/transducers'
import { Vec, vec2, Vec2, VecPair, perpendicularCW, mag, normalize, add, mulN } from '@thi.ng/vectors'
import { SYSTEM } from '@thi.ng/random'

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

        // this.dpr = window.devicePixelRatio || 1
        const { ctx } = adaptiveCanvas2d(this.width, this.height, appElm)
        this.ctx = ctx

        // scale canvas so shortest side is in range [-1, 1]
        if (this.width > this.height) {
            const scale = this.height / 2.0
            this.ctx.scale(scale, scale)
            this.ctx.translate((this.width * 0.5) / scale, 1.0)
        } else {
            const scale = this.width / 2.0
            this.ctx.scale(scale, scale)
            this.ctx.translate(1.0, (this.height * 0.5) / scale)
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

    update(iteration: number): number {
        // TODO: create the points yourself
        const shape = this.shapeGen.next().value

        const points = transduce(
            comp(
                map((edge) => {
                    // cut the edge at some point near the middle
                    const breakPt = pointAt(line(edge), 0.5)!
                    // determine vector perpendicular to edge
                    const vecAB = asVec2(edge)
                    const perp = perpendicularCW([], vecAB)
                    const length = mag(vecAB)
                    // distrub the angle
                    // TODO:
                    // project the break point outwards
                    const proj = mulN([], normalize(null, perp), length * 0.5)
                    const pt = add([], breakPt, proj)

                    // return new edge (2nd edge is defined by end of this edge and start of next)
                    return [edge[0] as Vec, pt]
                }),
                flatten1()
                // trace()
            ),
            push<Vec>(),
            edges(shape)
        )
        const poly = polygon(points, shape.attribs)

        // (1) break the edge at some random point in the middle of each edge
        // (2) angle of break
        // (3) magnitude edge extends outwards
        // NOTE: seems like the angle of break can define the magnitude (3)

        // const circ = circle([this.width / 2, this.height / 2], 100, { fill: tinycolor(this.params.tint).toRgbString() })
        // const poly = asPolygon(rotate(circ, 0.1))
        // let poly = asPolygon(circ, 12)
        // poly = rotate(poly, Math.PI / 8.0)

        this.shapes.push(poly)

        this.stop()
        return iteration
    }

    render() {
        const bgColor = tinycolor(this.params.background)
        draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])
    }
}
