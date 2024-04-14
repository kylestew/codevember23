import { adaptiveCanvas2d } from '@thi.ng/canvas'
import { Sketch, SketchParams } from './types'
import tinycolor from 'tinycolor2'
import { draw } from '@thi.ng/hiccup-canvas'
import { circle, Polygon, asPolygon, points, edges, line, arcLength, Line, pointAt, polygon } from '@thi.ng/geom'
import { transduce, comp, push, trace, map, mapcat, flatten1, pluck } from '@thi.ng/transducers'
import { Vec, vec2, Vec2, VecPair, perpendicularCW, mag, normalize, add, mulN, rotate } from '@thi.ng/vectors'
import { SYSTEM, gaussian } from '@thi.ng/random'
import { clamp01 } from '@thi.ng/math'

function asVec2(p: VecPair): Vec2 {
    return vec2(p[1][0] - p[0][0], p[1][1] - p[0][1])
}

type EdgeInfo = {
    edge: VecPair
    variablity: number
    iteration: number
}
function edgeListToPoly(edgeList: EdgeInfo[], attribs: any): Polygon {
    return polygon(
        transduce(
            map(({ edge }) => edge[0]),
            push(),
            edgeList
        ),
        attribs
    )
}

export class MySketch extends Sketch {
    private ctx: CanvasRenderingContext2D
    private width: number = 640
    private height: number = 480

    private shapes: Polygon[] = []

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

    makeShape(): Polygon {
        // TODO: make more organic shapes
        const r = 0.5
        return asPolygon(
            circle([0, 0], r, { fill: tinycolor(this.params.tint).toRgbString() }), //
            10
        )
    }

    randomVariablility(): number {
        const gauss = gaussian(SYSTEM, 24, 1.0, 1.0)
        return gauss()
    }
    mutateVariablility(variablity: number): number {
        // mutate just a little bit each iteration
        const gauss = gaussian(SYSTEM, 24, 0.0, 0.3)
        return gauss() + variablity
    }
    randomEdgeBreak(variance: number): number {
        // gaussian ditro centered around 0.5 with a scale of 2
        const gauss = gaussian(SYSTEM, 24, 0.5, 2.0)
        return clamp01(gauss() * variance)
    }
    randomAngle(variance: number): number {
        return gaussian(SYSTEM, 24, 0.0, 2.0 * Math.PI)() * variance
    }
    randomLength(edgeLength: number, variance: number): number {
        return Math.abs(gaussian(SYSTEM, 24, 0.0, 3.0)()) * edgeLength * variance
    }

    iterateCoastline(edgeList: EdgeInfo[]): EdgeInfo[] {
        return transduce(
            mapcat(({ edge, variablity, iteration }) => {
                // cut the edge at some point near the middle
                const breakPt = pointAt(line(edge), this.randomEdgeBreak(variablity))!
                // determine vector perpendicular to edge
                const vecAB = asVec2(edge)
                let perp = perpendicularCW([], vecAB)
                const length = mag(vecAB)
                // adjust the angle a random amount
                rotate(perp, perp, this.randomAngle(variablity))
                // project the break point outwards
                const proj = mulN([], normalize(null, perp), this.randomLength(length, variablity))
                const pt = add([], breakPt, proj)

                return [
                    {
                        edge: [edge[0] as Vec, pt] as VecPair,
                        variablity: this.mutateVariablility(variablity),
                        iteration: iteration + 1,
                    },
                    {
                        edge: [pt, edge[1] as Vec] as VecPair,
                        variablity: this.mutateVariablility(variablity),
                        iteration: iteration + 1,
                    },
                ]
            }),
            push<EdgeInfo>(),
            edgeList
        )
    }

    update(iteration: number): number {
        const baseShape = this.makeShape()

        // convert to edges, we only work with edges now
        // and need to collapse back into polys at the last minute
        const startingEdges: IterableIterator<EdgeInfo> = map(
            (edge) => ({
                edge,
                variablity: this.randomVariablility(),
                iteration: 0,
            }),
            edges(baseShape)
        )

        // create a base subdivided poly (consisting of edges)
        let baseEdgeList = [...startingEdges]

        // in 3 phases, break down the base polygon
        const fillColor = tinycolor(this.params.tint)
        let alpha = 0.08
        for (let i = 0; i < 3; i++) {
            baseEdgeList = this.iterateCoastline(baseEdgeList)
            alpha -= 0.02

            // subdivide this generation many times adding them up
            for (let i = 0; i < 33; i++) {
                let subEdgeList = this.iterateCoastline(baseEdgeList)
                subEdgeList = this.iterateCoastline(subEdgeList)
                subEdgeList = this.iterateCoastline(subEdgeList)
                this.shapes.push(edgeListToPoly(subEdgeList, { fill: fillColor.setAlpha(alpha).toRgbString() }))
            }
        }

        this.stop()
        return iteration
    }

    render() {
        const bgColor = tinycolor(this.params.background)
        draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])
        // TODO: draw with masking for texture
    }
}
