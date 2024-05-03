import { createCanvas } from 'canvas-utils'
import { SYSTEM } from '@thi.ng/random'
import { draw } from '@thi.ng/hiccup-canvas'
// files in /lib need these
import {} from '@thi.ng/geom'
import {} from '@thi.ng/geom-api'
import {} from '@thi.ng/vectors'
import {} from '@thi.ng/random'
import { GlyphPacker } from './libs/glyphs/GlyphPacker'
import { SetGlyphMaker } from './libs/glyphs/SetGlyphMaker'
import { childsBlocks } from './libs/assets/glyphs'

const w = 1000
const h = 1000
// const ctx = createCanvas(w, h, 'sketchCanvas')
const packer = new GlyphPacker(w, h, 1)

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

packer.glyphMakers = [
    new SetGlyphMaker(
        8,
        1000, // count, attempts

        // not a scaled canvas, shapes are in [0, 1] space
        20,
        200.0,
        4.0, // min, max, step

        childsBlocks,

        // placement rule
        () => {
            // place anywhere
            return [SYSTEM.float(w), SYSTEM.float(h)]
        },
        // rotation rule
        randomPI_2,
        // hollow rule
        never
    ),
]
console.log(childsBlocks)
console.log('MAKE MORE GLYPHS in glyphs.js')

let placedGlyphs = []
const nextGlyph = packer.next()
if (nextGlyph) {
    placedGlyphs.push(nextGlyph)

    render()
    //     // LOOP
}

function render() {
    packer.packer.dumpDebugCanvas('packed')
    //         // this.packer.dumpToCanvas('packed')
    //         this.outputElm.innerHTML = asSvg(
    //             svgDoc(
    //                 {
    //                     width: this.width,
    //                     height: this.height,
    //                     viewBox: `0 0 ${this.width} ${this.height}`,
    //                     fill: '#000',
    //                 },
    //                 ...this.placedGlyphs
    //                     .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
    //                     .flat()
    //             )
    //         )
}

// NOTE: for multi path glyphs, rotation and scaling can be applied in the Maker to each individual path first
// then full scale / rotation / etc done in packer
// QUESTION: does it need to be done with one Path or Path[]

// ctx.background('#333344')
// draw(ctx, ['g', { __background: '#333344' }, ...coloredWedges])

//     private attempts: number = 0
//     private totalAttempts: number = 0

//     setup() {
//         this.glyphMakers = [
//             // TODO: shapes
//             new ShapeGlyphMaker(
//                 8,
//                 1000, // count, attempts

//                 // not a scaled canvas, shapes are in [0, 1] space
//                 20,
//                 200.0,
//                 4.0, // min, max, step

//                 this.params.shapeSet,

//                 // placement rule
//                 () => {
//                     // place anywhere
//                     return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
//                 },
//                 // rotation rule
//                 randomPI_2,
//                 // hollow rule
//                 never
//             ),

//             // large fonts
//             new FontGlyphMaker(
//                 20,
//                 1000, // count, attempts

//                 2.0,
//                 3.0,
//                 0.1, // min, max, step
//                 this.params.fonts,
//                 this.params.characterSet,
//                 () => {
//                     // place anywhere
//                     return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
//                 },
//                 randomPI_4,
//                 never
//             ),

//             // small fonts
//             new FontGlyphMaker(
//                 100,
//                 1000, // count, attempts

//                 0.5,
//                 2.0,
//                 0.1, // min, max, step

//                 this.params.fonts,
//                 this.params.characterSet,

//                 () => {
//                     // place anywhere
//                     return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
//                 },
//                 randomPI_2,
//                 never
//             ),

//             // tiny fonts
//             new FontGlyphMaker(
//                 200,
//                 4000,

//                 0.05,
//                 0.5,
//                 0.01, // min, max, step

//                 this.params.fonts,
//                 this.params.characterSet,

//                 () => {
//                     // place anywhere
//                     return [SYSTEM.float(this.width), SYSTEM.float(this.height)]
//                 },
//                 randomPI_4,
//                 never
//             ),
//         ]

//         this.attempts = 0
//         this.totalAttempts = this.glyphMakers.reduce((acc, maker) => acc + maker.attempts, 0)
//     }

//
// }
