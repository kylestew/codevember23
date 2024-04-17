import { SketchParams } from './types'
import { Sketch, SketchState } from './util/Sketch'
import { SYSTEM } from '@thi.ng/random'
import { asSvg, svgDoc, scale, rotate, bounds, translate, Rect } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'

import { CanvasPacker } from './shared_lib/CanvasPacker'
import { Glyph, GlyphMaker, FontGlyphMaker, ShapeGlyphMaker } from './lib/glyph-vend'

// == SOME GLYPH RULES ==
const always = () => true
const never = () => false
const randomPI_2 = () => {
    return (SYSTEM.minmaxInt(0, 3) * Math.PI) / 2
}
const randomPI_4 = () => {
    return (SYSTEM.minmaxInt(0, 7) * Math.PI) / 4
}
// ======================

export class MySketch extends Sketch {
    private outputElm: HTMLElement
    private width: number
    private height: number

    private glyphMakers: GlyphMaker[] = []
    private packer: CanvasPacker

    private iteration: number = 0
    private placedGlyphs: Glyph[] = []

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, 1)

        this.outputElm = appElm
        this.width = params.canvasSize.width
        this.height = params.canvasSize.height

        this.packer = new CanvasPacker(this.width, this.height, 1)
    }

    setup() {
        this.iteration = 0

        this.placedGlyphs = []
        this.packer = new CanvasPacker(this.width, this.height, 1)

        this.glyphMakers = [
            // TODO: shapes
            new ShapeGlyphMaker(
                // TODO: do by count instead?
                0.01, // percent progress

                // not a scaled canvas, shapes are in [0, 1] space
                20,
                200.0,
                4.0, // min, max, step

                this.params.shapeSet,

                // placement rule
                () => {
                    // place anywhere
                    return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
                },
                // rotation rule
                randomPI_2,
                // hollow rule
                never
            ),

            // // large fonts
            // new FontGlyphMaker(
            //     0.2, // percent progress
            //     2.0,
            //     3.0,
            //     0.1, // min, max, step
            //     this.params.fonts,
            //     this.params.characterSet,
            //     () => {
            //         // place anywhere
            //         return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
            //     },
            //     () => {
            //         // never hollow
            //         return false
            //     }
            // ),

            // small fonts
            new FontGlyphMaker(
                0.6, // percent progress
                0.5,
                2.0,
                0.1, // min, max, step
                this.params.fonts,
                this.params.characterSet,
                () => {
                    // place anywhere
                    return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
                },
                never,
                () => {
                    // never hollow
                    return false
                }
            ),

            // // tiny fonts
            // new FontGlyphMaker(
            //     1.0, // percent progress
            //     0.1,
            //     0.5,
            //     0.01, // min, max, step
            //     this.params.fonts,
            //     this.params.characterSet,
            //     () => {
            //         // place anywhere
            //         return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
            //     },
            //     () => {
            //         // never hollow
            //         return false
            //     }
            // ),
        ]
    }

    next(): SketchState {
        if (this.iteration++ > this.params.attempts) {
            return { status: 'stopped', progress: 0 }
        }

        // select glyph vendor based on progress
        const progress = this.iteration / this.params.attempts
        const maker =
            this.glyphMakers.find((maker) => progress <= maker.progress) ??
            this.glyphMakers[this.glyphMakers.length - 1]
        const glyph = maker.make()

        const transformGlyph = (glyph: Glyph) => {
            return translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position)
        }

        const glyphCanvasRenderer = (ctx: OffscreenCanvasRenderingContext2D) => {
            const fill = glyph.hollow ? '#0000' : '#000'
            draw(ctx, ['g', { fill, stroke: '#000', weight: this.params.padding }, transformGlyph(glyph)])
        }

        let placedGlyph: Glyph | undefined = undefined
        while (
            glyph.scale <= maker.maxScale &&
            this.packer.canPlaceShape(bounds(transformGlyph(glyph)) as Rect, glyphCanvasRenderer)
        ) {
            placedGlyph = { ...glyph }
            // attempt to step it up
            glyph.scale += maker.scaleStepSize
        }

        if (placedGlyph !== undefined) {
            this.placedGlyphs.push(placedGlyph)

            // draw to placed glyphs
            this.packer.commitShape(glyphCanvasRenderer)

            this.render()
        }

        return { status: 'running', progress }
    }

    render() {
        // this.packer.dumpToCanvas('packed')

        this.outputElm.innerHTML = asSvg(
            svgDoc(
                {
                    width: this.width,
                    height: this.height,
                    viewBox: `0 0 ${this.width} ${this.height}`,
                    fill: '#000',
                },
                ...this.placedGlyphs
                    .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
                    .flat()
            )
        )
    }
}
