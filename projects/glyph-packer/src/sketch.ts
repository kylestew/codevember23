import { BoundingBox, Font } from 'opentype.js'
import { transduce, pluck, trace, flatten, map, mapcat, filter, push, comp } from '@thi.ng/transducers'
import { SYSTEM, pickRandom } from '@thi.ng/random'
import { Vec } from '@thi.ng/vectors'
import { parse as parseXML, Type } from '@thi.ng/sax'
import { Path, pathFromSvg, asSvg, svgDoc, asPolygon } from '@thi.ng/geom'

import { Sketch, SketchParams } from './types'
import { ShapePacker } from './lib/ShapePacker'

interface Glyph {
    position: Vec
    scale: number
    rotation: number
    fill: boolean // or stroke if false
    paths: Path[]
}

export class MySketch extends Sketch {
    private outputElm: HTMLElement
    private width: number
    private height: number

    private packer: ShapePacker
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
        this.packer = new ShapePacker(this.width, this.height, 1)
    }

    setup() {
        this.packer = new ShapePacker(this.width, this.height, 1)
        this.attempts = this.params.density * 10000 // [0,1] -> [0, 10000]
    }

    randomGlyph(): Glyph {
        const font = pickRandom(this.params.fonts)
        const letter = pickRandom(this.params.characterSet)

        const x = SYSTEM.float(this.width)
        const y = SYSTEM.float(this.height)

        const paths = transduce(
            comp(
                // opentype to SVG string
                mapcat((letter) => font.getPath(letter, x, y, 64.0).toSVG(2)),
                // svg string to SAX events
                parseXML(), //
                // filter for path elements
                filter((ev) => ev.type === Type.ELEM_END && ev.tag === 'path'),
                // convert path strings to geom.Path objects
                mapcat((ev) => pathFromSvg(ev.attribs!.d))
                // // convert paths to polygons to vertices
                // mapcat((path) => vertices(asPolygon(path), { dist: circleRad * 2 })),
            ),
            push<Path>(),
            [letter]
        )

        return {
            position: [x, y],
            scale: 1.0,
            rotation: 0,
            fill: true,
            paths,
        }
    }

    update(iteration: number): number {
        if (iteration > this.attempts) {
            this.stop()
            return 0
        }

        // try to place one glyph
        const glyph = this.randomGlyph()
        // glyph.scale = this.minScale

        let placedGlyph = glyph
        // let placedGlyph: Glyph | undefined
        // while (
        //     glyph.scale <= this.maxScale
        //     // &&
        //     // this.packer.canPlaceShape(asRect(path.getBoundingBox()), (ctx: OffscreenCanvasRenderingContext2D) => {
        //     //     ctx.lineWidth = this.strokePadding
        //     //     path.draw(ctx)
        //     //     if (this.strokePadding > 0) ctx.stroke() // adds a stroke to space out glyphs
        //     // })
        // ) {
        //     placedGlyph = { ...glyph }

        //     // attempt to step it up
        //     glyph.scale += this.scaleStepSize
        // }

        if (placedGlyph) {
            this.placedGlyphs.push(placedGlyph)
            this.dirty = true

            // draw to placed glyphs
            this.packer.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
                // TODO: draw again
                // //         const path = placedGlyph.font.getPath(
                // //             placedGlyph.letter,
                // //             placedGlyph.pos[0],
                // //             placedGlyph.pos[1],
                // //             placedGlyph.fontSize
                //         )
                //         ctx.lineWidth = this.strokePadding
                //         path.draw(ctx)
                //         if (this.strokePadding > 0) ctx.stroke() // adds a stroke to space out glyphs
            })
        }
        return (iteration / this.attempts) * 100
    }

    render() {
        this.outputElm.innerHTML = asSvg(
            svgDoc({ width: this.width, height: this.height }, ...this.placedGlyphs.map((glyph) => glyph.paths).flat())
        )
    }
}

/*
function asRect(bounds: BoundingBox): Rect {
    return new Rect([bounds.x1, bounds.y1], [bounds.x1 + bounds.x2, bounds.y1 + bounds.y2])
}
*/
