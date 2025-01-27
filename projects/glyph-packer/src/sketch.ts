import { SketchParams } from './types'
import { Sketch, SketchState } from './util/Sketch'
import { SYSTEM } from '@thi.ng/random'
import { asSvg, svgDoc, scale, rotate, bounds, translate, Rect } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'

// import { CanvasPacker } from './shared_lib/CanvasPacker'
// import { Glyph, GlyphMaker, FontGlyphMaker, ShapeGlyphMaker } from './lib/glyph-vend'

// == SOME GLYPH RULES ==
// const always = () => true
// const never = () => false
// const randomPI_2 = () => {
//     return (SYSTEM.minmaxInt(0, 3) * Math.PI) / 2
// }
// const randomPI_4 = () => {
//     return (SYSTEM.minmaxInt(0, 7) * Math.PI) / 4
// }
// ======================

export class MySketch extends Sketch {
    private outputElm: HTMLElement
    private width: number
    private height: number

    // private glyphMakers: GlyphMaker[] = []
    // private packer: CanvasPacker

    // private attempts: number = 0
    // private totalAttempts: number = 0
    // private placedGlyphs: Glyph[] = []

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, 1)

        this.outputElm = appElm
        this.width = params.canvasSize.width
        this.height = params.canvasSize.height

        // this.packer = new CanvasPacker(this.width, this.height, 1)
    }

    setup() {
        // this.placedGlyphs = []
        // this.packer = new CanvasPacker(this.width, this.height, 1)
        // this.glyphMakers = [
        //     // TODO: shapes
        //     new ShapeGlyphMaker(
        //         8,
        //         1000, // count, attempts
        //         // not a scaled canvas, shapes are in [0, 1] space
        //         20,
        //         200.0,
        //         4.0, // min, max, step
        //         this.params.shapeSet,
        //         // placement rule
        //         () => {
        //             // place anywhere
        //             return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
        //         },
        //         // rotation rule
        //         randomPI_2,
        //         // hollow rule
        //         never
        //     ),
        //     // large fonts
        //     new FontGlyphMaker(
        //         20,
        //         1000, // count, attempts
        //         2.0,
        //         3.0,
        //         0.1, // min, max, step
        //         this.params.fonts,
        //         this.params.characterSet,
        //         () => {
        //             // place anywhere
        //             return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
        //         },
        //         randomPI_4,
        //         never
        //     ),
        //     // small fonts
        //     new FontGlyphMaker(
        //         100,
        //         1000, // count, attempts
        //         0.5,
        //         2.0,
        //         0.1, // min, max, step
        //         this.params.fonts,
        //         this.params.characterSet,
        //         () => {
        //             // place anywhere
        //             return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
        //         },
        //         randomPI_2,
        //         never
        //     ),
        //     // tiny fonts
        //     new FontGlyphMaker(
        //         200,
        //         4000,
        //         0.05,
        //         0.5,
        //         0.01, // min, max, step
        //         this.params.fonts,
        //         this.params.characterSet,
        //         () => {
        //             // place anywhere
        //             return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
        //         },
        //         randomPI_4,
        //         never
        //     ),
        // ]
        // this.attempts = 0
        // this.totalAttempts = this.glyphMakers.reduce((acc, maker) => acc + maker.attempts, 0)
    }

    next(): SketchState {
        // if (this.glyphMakers.length === 0) {
        //     // nothing left to do
        //     return { status: 'stopped', progress: 0 }
        // }

        // // do we still have attempts to make?
        // const maker = this.glyphMakers[0]
        // if (maker.attempts === 0 || maker.count === 0) {
        //     // remove maker - will not be available on next iteration
        //     this.glyphMakers.shift()
        // }
        // maker.attempts--

        // const glyph = maker.make()
        // const transformGlyph = (glyph: Glyph) => {
        //     return translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position)
        // }
        // const glyphCanvasRenderer = (ctx: OffscreenCanvasRenderingContext2D) => {
        //     const fill = glyph.hollow ? '#0000' : '#000'
        //     draw(ctx, ['g', { fill, stroke: '#000', weight: this.params.padding }, transformGlyph(glyph)])
        // }

        // let placedGlyph: Glyph | undefined = undefined
        // while (
        //     glyph.scale <= maker.maxScale &&
        //     this.packer.canPlaceShape(bounds(transformGlyph(glyph)) as Rect, glyphCanvasRenderer)
        // ) {
        //     placedGlyph = { ...glyph }
        //     // attempt to step it up
        //     glyph.scale += maker.scaleStepSize
        // }

        // if (placedGlyph !== undefined) {
        //     this.placedGlyphs.push(placedGlyph)
        //     maker.count--

        //     // draw to placed glyphs
        //     this.packer.commitShape(glyphCanvasRenderer)

        //     this.render()
        // }
        //
        // return { status: 'running', progress: this.attempts++ / this.totalAttempts }
        return { status: 'running', progress: 0 }
    }

    render() {
        // this.packer.dumpToCanvas('packed')
        // this.outputElm.innerHTML = asSvg(
        //     svgDoc(
        //         {
        //             width: this.width,
        //             height: this.height,
        //             viewBox: `0 0 ${this.width} ${this.height}`,
        //             fill: '#000',
        //         },
        //         ...this.placedGlyphs
        //             .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
        //             .flat()
        //     )
        // )
    }
}
