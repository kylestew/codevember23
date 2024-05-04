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
import { alphaNumericCharacterSet } from './character-sets'
import { loadFontSet } from './font-loader'

const w = 900
const h = 900
const outputElm = document.getElementById('output')
const ctx = createCanvas(w, h, 'sketchCanvas')
const packer = new GlyphPacker(w, h, 2, 1)
const renderDest = 'canvas'

const bg = '#055a5b'
const fg = '#e6e6e6'

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
const smallRotation = (mu = 0.1) => {
    const gauss = gaussian(SYSTEM, 24, 0, mu)
    return () => {
        return gauss()
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
    //     6,
    //     1000, // count, attempts
    //     // not a scaled canvas, shapes are in [0, 1] space

    //     [96, 128],
    //     1.0, // range, step

    //     // placement rule
    //     gaussPosition(2),
    //     // rotation rule
    //     randomPI_4,
    //     // hollow rule
    //     never,
    //
    //     childsBlocks
    // ),
    // new SetGlyphMaker(
    //     1000,
    //     100000, // count, attempts
    //     // not a scaled canvas, shapes are in [0, 1] space

    //     [12, 24],
    //     1.0, // range, step

    //     // placement rule
    //     randomPosition,
    //     // rotation rule
    //     () => {
    //         return randomPI_4() + smallRotation(0.1)()
    //     },
    //     // hollow rule
    //     never,
    //
    //     childsBlocks,
    // ),

    new FontGlyphMaker(
        6,
        1000, // count, attempts

        [6.0, 6.2],
        0.1, // range, step

        // placement rule
        gaussPosition(2.4),
        // rotation rule
        never,
        // hollow rule
        never,

        fontSet,
        alphaNumericCharacterSet
    ),
    new FontGlyphMaker(
        1000,
        100000, // count, attempts

        [0.2, 1.0],
        0.1, // range, step

        // placement rule
        randomPosition,
        // rotation rule
        smallRotation(0.2),
        // hollow rule
        never,

        fontSet,
        alphaNumericCharacterSet.concat(['cat'])
    ),
]

let placedGlyphs = []
function placeGlyphs() {
    const nextGlyph = packer.next()

    if (nextGlyph !== false) {
        if (nextGlyph !== true) {
            placedGlyphs.push(nextGlyph)
            render(renderDest)
        }
        requestAnimationFrame(placeGlyphs)
    } // else - packing complete
}
placeGlyphs()

function render(type = 'canvas') {
    if (type === 'debug') {
        packer.packer.dumpDebugCanvas('packed')
    } else if (type === 'svg') {
        outputElm.innerHTML = asSvg(
            svgDoc(
                {
                    style: 'background-color: ' + bg,
                    width: w,
                    height: h,
                    viewBox: `0 0 ${w} ${h}`,
                    fill: fg,
                    stroke: '#00000000',
                    // stroke: '#fff',
                },
                ...placedGlyphs
                    .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
                    .flat()
            )
        )
    } else {
        draw(ctx, [
            'g',
            {
                __background: bg,
                fill: fg,
                stroke: '#00000000',
            },
            ...placedGlyphs
                .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
                .flat(),
        ])
    }
}
