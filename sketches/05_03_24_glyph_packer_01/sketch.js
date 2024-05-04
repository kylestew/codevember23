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

const w = 900
const h = 900
const outputElm = document.getElementById('output')
const ctx = createCanvas(w, h, 'sketchCanvas')
const packer = new GlyphPacker(w, h, 2, 1)
const renderDest = 'canvas'

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
        2,
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
                    style: 'background-color: #E33946;',
                    width: w,
                    height: h,
                    viewBox: `0 0 ${w} ${h}`,
                    fill: '#fdedb2',
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
                __background: '#E33946',
                fill: '#fdedb2',
                stroke: '#00000000',
            },
            ...placedGlyphs
                .map((glyph) => translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position))
                .flat(),
        ])
    }
}
