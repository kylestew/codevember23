import { createCanvas } from 'canvas-utils'
import { SYSTEM, gaussian } from '@thi.ng/random'
import { bounds, rect, asSvg, translate, scale, rotate, svgDoc } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'
// files in /lib need these
import {} from '@thi.ng/geom-api'
import {} from '@thi.ng/vectors'
import {} from '@thi.ng/transducers'
import { GlyphPacker } from './libs/glyphs/GlyphPacker'
import { SetGlyphMaker } from './libs/glyphs/SetGlyphMaker'
import { FontGlyphMaker } from './libs/glyphs/FontGlyphMaker'
import { childsBlocks } from './libs/assets/glyphs'
import { loadFontSet } from './font-loader'

const w = 1200
const h = 1920
const outputElm = document.getElementById('output')
const ctx = createCanvas(w, h, 'sketchCanvas')
const packer = new GlyphPacker(w, h, 2, 1)

const fontSet = await loadFontSet()

// == SOME GLYPH RULES ==
const always = () => true
const never = () => false
const randomPosition = () => [SYSTEM.minmax(0, w), SYSTEM.minmax(0, h)]
const gaussPosition = (mu = 1.0) => {
    const gauss = gaussian(SYSTEM, 24, 0, mu)
    return () => {
        return [gauss() * w + w / 2.0, gauss() * h + h / 2.0]
    }
}
const randomRotation = () => SYSTEM.float(Math.PI * 2)
const randomPI_2 = () => {
    return (SYSTEM.minmaxInt(0, 3) * Math.PI) / 2
}
const randomPI_4 = () => {
    return (SYSTEM.minmaxInt(0, 7) * Math.PI) / 4
}
// ======================

packer.glyphMakers = [
    // new SetGlyphMaker(
    //     12,
    //     100, // count, attempts
    //     // not a scaled canvas, shapes are in [0, 1] space

    //     [32, 128],
    //     1.0, // range, step

    //     childsBlocks,
    //     // placement rule
    //     randomPosition,
    //     // rotation rule
    //     randomPI_4,
    //     // hollow rule
    //     () => SYSTEM.float() < 0.5
    //     // never
    // ),

    new FontGlyphMaker(
        2000,
        200000, // count, attempts

        [0.2, 6.0],
        0.2, // range, step

        randomPosition,
        randomPI_2,
        never,

        fontSet,
        ['eat', 'sleep', 'rave', 'repeat']
    ),
]

let placedGlyphs = []
function doLoop() {
    const nextGlyph = packer.next()

    if (nextGlyph !== false) {
        if (nextGlyph !== true) {
            // new glyph!
            placedGlyphs.push(nextGlyph)
            render()
        }
        requestAnimationFrame(doLoop)
    } // else - packing complete
}
doLoop()

function render() {
    // packer.packer.dumpDebugCanvas('packed')
    // outputElm.innerHTML = asSvg(
    //     svgDoc(
    //         {
    //             style: 'background-color: #E33946;',
    //             width: w,
    //             height: h,
    //             viewBox: `0 0 ${w} ${h}`,
    //             fill: '#fdedb2',
    //             stroke: '#00000000',
    //             // stroke: '#fff',
    //         },
    //         ...placedGlyphs
    //             .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
    //             .flat()
    //     )
    // )
    draw(ctx, [
        'g',
        {
            __background: '#E33946',
            fill: '#fdedb2',
            stroke: '#00000000',
        },
        ...placedGlyphs
            .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
            .flat(),
    ])
}

// NOTE: for multi path glyphs, rotation and scaling can be applied in the Maker to each individual path first
// then full scale / rotation / etc done in packer
// QUESTION: does it need to be done with one Path or Path[]

// ctx.background('#333344')
// draw(ctx, ['g', { __background: '#333344' }, ...coloredWedges])

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
