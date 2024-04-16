import { BoundingBox, Font } from 'opentype.js'
import { transduce, pluck, trace, flatten, map, mapcat, filter, push, comp } from '@thi.ng/transducers'
import { SYSTEM, pickRandom } from '@thi.ng/random'
import { Vec } from '@thi.ng/vectors'
import { parse as parseXML, Type } from '@thi.ng/sax'
import {
    Path,
    path,
    pathFromSvg,
    asSvg,
    svgDoc,
    scale,
    bounds,
    points,
    translate,
    Rect,
    centroid,
    center,
} from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'
import { PathSegment } from '@thi.ng/geom-api'

import { Sketch, SketchParams } from './types'
import { CanvasPacker } from './lib/CanvasPacker'

interface Glyph {
    path: Path

    position: Vec
    scale: number
    // rotation: number
    // fill: boolean // or stroke if false
}

// TODO: define one ore more glyph loaders that generate a base path that can be scaled
// and some rules as to sizes, locations, rotations, etc

export class MySketch extends Sketch {
    private outputElm: HTMLElement
    private width: number
    private height: number

    private packer: CanvasPacker
    private attempts: number = 0

    // TODO: bring these in as params
    private minScale = 0.2
    private maxScale = 4.0
    private scaleStepSize = 0.02
    private glyphPadding = 2

    placedGlyphs: Glyph[] = []

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, 1)

        this.outputElm = appElm
        this.width = params.canvasSize.width
        this.height = params.canvasSize.height
        this.packer = new CanvasPacker(this.width, this.height, 1)
    }

    setup() {
        this.placedGlyphs = []
        this.packer = new CanvasPacker(this.width, this.height, 1)
        this.attempts = this.params.density * 10000 // [0,1] -> [0, 10000]
    }

    // vend next glyph
    nextGlyph(): Glyph {
        const font = pickRandom(this.params.fonts)
        const letter = pickRandom(this.params.characterSet)

        const x = SYSTEM.float(this.width)
        const y = SYSTEM.float(this.height)

        const segments = transduce(
            comp(
                // opentype to SVG string
                map((letter) => font.getPath(letter, 0, 0, 64.0).toPathData(4)),
                // trace(),
                // convert path string to geom.Path objects
                mapcat((d) => pathFromSvg(d)),
                // trace(),
                // flatten segments
                mapcat((path) => path.segments)
                // trace()
            ),
            push<PathSegment>(),
            [letter]
        )

        // center the path on itself
        let centeredPath = path(segments)
        const cent = centroid(bounds(centeredPath))
        centeredPath = translate(centeredPath, [-cent[0], -cent[1]]) as Path

        return {
            path: centeredPath,

            position: [x, y],
            scale: 1.0,
            // rotation: 0,
            // fill: true,
        }
    }

    update(iteration: number): number {
        if (iteration > this.attempts) {
            this.stop()
            return 0
        }

        // try to place one glyph
        const glyph = this.nextGlyph()
        glyph.scale = this.minScale

        let placedGlyph: Glyph | undefined = undefined
        while (
            glyph.scale <= this.maxScale &&
            this.packer.canPlaceShape(
                bounds(scale(glyph.path, glyph.scale)) as Rect,
                (ctx: OffscreenCanvasRenderingContext2D) => {
                    draw(ctx, [
                        'g',
                        { fill: '#000', stroke: '#000', weight: this.glyphPadding },
                        translate(scale(glyph.path, glyph.scale), glyph.position),
                    ])
                }
            )
        ) {
            placedGlyph = { ...glyph }

            // attempt to step it up
            glyph.scale += this.scaleStepSize
        }

        if (placedGlyph !== undefined) {
            this.placedGlyphs.push(placedGlyph)
            this.dirty = true

            // draw to placed glyphs
            this.packer.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
                draw(ctx, [
                    'g',
                    { fill: '#000', stroke: '#000', weight: this.glyphPadding },
                    translate(scale(placedGlyph.path, placedGlyph.scale), placedGlyph.position),
                ])
            })
        }
        return (iteration / this.attempts) * 100
    }

    render() {
        // this.packer.dumpToCanvas('packed')

        this.outputElm.innerHTML = asSvg(
            svgDoc(
                { width: this.width, height: this.height, viewBox: `0 0 ${this.width} ${this.height}`, fill: '#000' },
                ...this.placedGlyphs.map((glyph) => translate(scale(glyph.path, glyph.scale), glyph.position)).flat()
            )
        )
    }
}
