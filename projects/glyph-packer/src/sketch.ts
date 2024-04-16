import { BoundingBox, Font } from 'opentype.js'
import { transduce, pluck, trace, flatten, map, mapcat, filter, push, comp } from '@thi.ng/transducers'
import { SYSTEM, pickRandom } from '@thi.ng/random'
import { Vec } from '@thi.ng/vectors'
import { parse as parseXML, Type } from '@thi.ng/sax'
import { Path, rect, pathFromSvg, asSvg, svgDoc, asPolygon, bounds } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'

import { Sketch, SketchParams } from './types'
import { CanvasPacker } from './lib/CanvasPacker'

interface Glyph {
    paths: Path[]

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
    private minScale = 0.1
    private maxScale = 2.0
    private scaleStepSize = 0.2
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
        this.packer = new CanvasPacker(this.width, this.height, 1)
        this.attempts = this.params.density * 10000 // [0,1] -> [0, 10000]
    }

    // vend next glyph
    nextGlyph(): Glyph {
        const font = pickRandom(this.params.fonts)
        // const letter = pickRandom(this.params.characterSet)
        const letter = 'A'

        const x = SYSTEM.float(this.width)
        const y = SYSTEM.float(this.height)

        const paths = transduce(
            comp(
                // opentype to SVG string
                map((letter) => font.getPath(letter, x, y, 64.0).toPathData(2)),
                // svg string to SAX events
                // parseXML(), //
                // filter for path elements
                // filter((ev) => ev.type === Type.ELEM_END && ev.tag === 'path'),
                // convert path strings to geom.Path objects
                // mapcat((ev) => pathFromSvg(ev.attribs!.d))
                trace(),
                mapcat((d) => pathFromSvg(d)),
                trace()
                // trace()
                // convert paths to polygons to vertices
                // mapcat((path) => vertices(asPolygon(path), { dist: circleRad * 2 })),
                // mapcat((path) => asPolygon(path))
            ),
            push<Path>(),
            [letter]
        )

        return {
            paths,
            position: [x, y],
            scale: 1.0,
            // rotation: 0,
            // fill: true,
        }
    }

    update(iteration: number): number {
        // if (iteration > this.attempts) {
        this.stop()
        // return 0
        // }

        // try to place one glyph
        const glyph = this.nextGlyph()
        glyph.scale = this.minScale

        console.log(glyph.paths)
        console.log(glyph.paths[0].toHiccup())

        // let placedGlyph: Glyph | undefined
        // while (
        //     glyph.scale <= this.maxScale &&
        //     this.packer.canPlaceShape(
        //         // not using bounding rect
        //         // asRect(bounds(glyph.paths)),
        //         rect([0, 0], [this.width, this.height]),
        //         (ctx: OffscreenCanvasRenderingContext2D) => {
        //             draw(ctx, { fill: '#000' }, [...glyph.paths][0])
        //             // draw(ctx, ['path', { fill: '#000', weight: this.glyphPadding }, ...glyph.paths])
        //         }
        //     )
        // ) {
        //     placedGlyph = { ...glyph }

        //     // attempt to step it up
        //     glyph.scale += this.scaleStepSize
        // }

        // if (placedGlyph) {
        //     this.placedGlyphs.push(placedGlyph)
        //     this.dirty = true

        //     this.stop()

        //     // draw to placed glyphs
        //     this.packer.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
        //         draw(ctx, ['path', { fill: '#000', stroke: '#000', weight: this.glyphPadding }, ...placedGlyph.paths])
        //     })
        // }
        return (iteration / this.attempts) * 100
    }

    render() {
        this.packer.dumpToCanvas('glyph')
        // this.outputElm.innerHTML = asSvg(
        //     svgDoc({ width: this.width, height: this.height }, ...this.placedGlyphs.map((glyph) => glyph.paths).flat())
        // )
    }
}

/*
function asRect(bounds: BoundingBox): Rect {
    return new Rect([bounds.x1, bounds.y1], [bounds.x1 + bounds.x2, bounds.y1 + bounds.y2])
}
*/
