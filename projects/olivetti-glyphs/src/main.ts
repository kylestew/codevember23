import { BoundingBox, Font } from 'opentype.js'
import { Rect } from '@thi.ng/geom'
import { transduce, map, push } from '@thi.ng/transducers'
import { pickRandom } from '@thi.ng/random'
import { Vec } from '@thi.ng/vectors'

import { alphaNumericCharacterSet } from './alphanumeric'
import { loadFontSet } from './font-set'
import { ShapePacker } from './ShapePacker'

type GlyphPlacement = { font: Font; letter: string; pos: Vec; fontSize: number }

const fonts = await loadFontSet()
// const characterSet = 'Speak softly and carry a big stick'.split('')
// array containing 61-73 ascii characters
const characterSet = alphaNumericCharacterSet

const ATTEMPTS = 1
const MIN_FONT_SIZE = 10
const MAX_FONT_SIZE = 256
const FONT_SIZE_STEP = 4
const CANVAS_WIDTH = 1200 / 2 // It's an SVG, you can work at smaller sizes and scale up
const CANVAS_HEIGHT = 1900 / 2
const STROKE_PADDING = 2

const packer = new ShapePacker(CANVAS_WIDTH, CANVAS_HEIGHT, 2)

function asRect(bounds: BoundingBox): Rect {
    return new Rect([bounds.x1, bounds.y1], [bounds.x1 + bounds.x2, bounds.y1 + bounds.y2])
}

// pack them!
/*
const placedGlyphs: GlyphPlacement[] = []
for (let i = 0; i < ATTEMPTS; i++) {
    // try to place one glyph
    const font = pickRandom(fonts)
    const letter = pickRandom(characterSet)
    // TODO: gaussian distribution centered aroudn the middle of the canvas
    let x = Math.random() * CANVAS_WIDTH * 1.2 - CANVAS_WIDTH * 0.1
    let y = Math.random() * CANVAS_HEIGHT * 1.2
    let fontSize = MIN_FONT_SIZE

    let path = font.getPath(letter, x, y, fontSize)
    let placedGlyph: GlyphPlacement | undefined
    while (
        fontSize <= MAX_FONT_SIZE &&
        packer.canPlaceShape(asRect(path.getBoundingBox()), (ctx: OffscreenCanvasRenderingContext2D) => {
            ctx.lineWidth = STROKE_PADDING
            path.draw(ctx)
            if (STROKE_PADDING > 0) ctx.stroke() // adds a stroke to space out glyphs
        })
    ) {
        placedGlyph = {
            font,
            letter,
            pos: [x, y],
            fontSize,
        }

        // attempt to step it up
        fontSize += FONT_SIZE_STEP
        path = font.getPath(letter, x, y, fontSize)
    }

    // we're we able to place the glyph?
    if (placedGlyph) {
        placedGlyphs.push(placedGlyph)

        // draw to packed canvas buffer
        packer.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
            const path = placedGlyph.font.getPath(
                placedGlyph.letter,
                placedGlyph.pos[0],
                placedGlyph.pos[1],
                placedGlyph.fontSize
            )
            ctx.lineWidth = STROKE_PADDING
            path.draw(ctx)
            if (STROKE_PADDING > 0) ctx.stroke() // adds a stroke to space out glyphs
        })
    }
}
console.log('placed', placedGlyphs.length)
*/

/*
let path = fonts[0].getPath('A', 20, 160, 200)
// console.log(path.getBoundingBox())
let result = packer.canPlaceShape(asRect(path.getBoundingBox()), (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.lineWidth = STROKE_PADDING
    path.draw(ctx)
    if (STROKE_PADDING > 0) ctx.stroke() // adds a stroke to space out glyphs
})
if (result) {
    packer.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
        ctx.lineWidth = STROKE_PADDING
        path.draw(ctx)
        if (STROKE_PADDING > 0) ctx.stroke() // adds a stroke to space out glyphs
    })
}
// path = fonts[0].getPath('A', 30, 170, 210)
// // console.log(path.getBoundingBox())
// result = packer.canPlaceShape(asRect(path.getBoundingBox()), (ctx: OffscreenCanvasRenderingContext2D) => {
//     ctx.lineWidth = STROKE_PADDING
//     path.draw(ctx)
//     if (STROKE_PADDING > 0) ctx.stroke() // adds a stroke to space out glyphs
// })
// console.log(result)
// path = fonts[0].getPath('A', 40, 180, 220)
// // console.log(path.getBoundingBox())
// result = packer.canPlaceShape(asRect(path.getBoundingBox()), (ctx: OffscreenCanvasRenderingContext2D) => {
//     ctx.lineWidth = STROKE_PADDING
//     path.draw(ctx)
//     if (STROKE_PADDING > 0) ctx.stroke() // adds a stroke to space out glyphs
// })
// console.log(result)
*/

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
packer.test()
// packer.dumpToCanvas(canvas, 'glyph')
// packer.dumpToCanvas(canvas, 'packed')
packer.dumpToCanvas(canvas, 'compare')

/*
// display them!
console.log('placed glyphs:', placedGlyphs.length)
let svgContent = `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">`
svgContent += `<g fill="black">`
// svgContent += `<g fill="none" stroke="red" stroke-width="1">`
svgContent += transduce(
    map(({ font, letter, pos, fontSize }) => font.getPath(letter, pos[0], pos[1], fontSize).toSVG()),
    push(),
    placedGlyphs
).join('\n')
svgContent += `</g>`
// svgContent += `<g fill="none" stroke="red" stroke-width="1">`
// svgContent += transduce(
//     comp(
//         pluck('circles'),
//         flatten(),
//         map((circle) => asSvg(circle))
//     ),
//     push(),
//     placedGlyphs
// ).join('\n')
// svgContent += `</g>`
svgContent += `</svg>`

document.body.innerHTML = svgContent
*/
