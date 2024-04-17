import { SketchParams } from './types'
import { Sketch, SketchState } from './util/Sketch'
import { SYSTEM } from '@thi.ng/random'
import { asSvg, svgDoc, scale, bounds, translate, Rect } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'

import { CanvasPacker } from './shared_lib/CanvasPacker'
import { Glyph, GlyphMaker, FontGlyphMaker } from './lib/glyph-vend'

export class MySketch extends Sketch {
    private outputElm: HTMLElement
    private width: number
    private height: number

    private glyphMakers: GlyphMaker[] = []
    private packer: CanvasPacker

    private iteration: number = 0
    private attempts: number = 0

    private placedGlyphs: Glyph[] = []

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

        this.iteration = 0
        this.attempts = this.params.density * 10000 // [0,1] -> [0, 10000]

        this.glyphMakers = [
            // TODO: shapes

            // large fonts
            new FontGlyphMaker(
                0.2, // percent progress
                2.0,
                3.0,
                0.1, // min, max, step
                this.params.fonts,
                this.params.characterSet,
                () => {
                    // place anywhere
                    return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
                },
                () => {
                    // never hollow
                    return false
                }
            ),
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
                () => {
                    // never hollow
                    return false
                }
            ),
            // tiny fonts
            new FontGlyphMaker(
                1.0, // percent progress
                0.1,
                0.5,
                0.01, // min, max, step
                this.params.fonts,
                this.params.characterSet,
                () => {
                    // place anywhere
                    return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
                },
                () => {
                    // never hollow
                    return false
                }
            ),
        ]
    }

    next(): SketchState {
        if (this.iteration++ > this.attempts) {
            return { status: 'stopped', progress: 0 }
        }

        // select glyph vendor based on progress
        const progress = this.iteration / this.attempts
        const maker =
            this.glyphMakers.find((maker) => progress <= maker.progress) ??
            this.glyphMakers[this.glyphMakers.length - 1]
        const glyph = maker.make()

        const glyphCanvasRenderer = (ctx: OffscreenCanvasRenderingContext2D) => {
            const fill = glyph.hollow ? '#0000' : '#000'
            draw(ctx, [
                'g',
                { fill, stroke: '#000', weight: this.params.padding },
                translate(scale(glyph.path, glyph.scale), glyph.position),
            ])
        }

        let placedGlyph: Glyph | undefined = undefined
        while (
            glyph.scale <= maker.maxScale &&
            this.packer.canPlaceShape(bounds(scale(glyph.path, glyph.scale)) as Rect, glyphCanvasRenderer)
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
                ...this.placedGlyphs.map((glyph) => translate(scale(glyph.path, glyph.scale), glyph.position)).flat()
            )
        )
    }
}
