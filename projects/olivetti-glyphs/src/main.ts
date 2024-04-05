import { parse as parseFont } from 'opentype.js'
import { parse as parseXML, Type } from '@thi.ng/sax'
import { Circle, circle, asPolygon, pathFromSvg, vertices, svgDoc, asSvg, intersects } from '@thi.ng/geom'
import { comp, mapcat, transduce, map, flatten, filter, push, range, pluck } from '@thi.ng/transducers'
import { pickRandom } from '@thi.ng/random'
import { Vec, dist } from '@thi.ng/vectors'

import fontFileURL from './assets/FiraSansOT-Medium.otf?url'
async function loadFont() {
    const response = await fetch(fontFileURL)
    const buffer = await response.arrayBuffer()
    const font = parseFont(buffer)
    return font
}
const font = await loadFont()

type GlyphPlacement = { letter: string; pos: Vec; fontSize: number; circles: Circle[] }

function createGlyphPlacement(letter: string, x: number, y: number, fontSize: number): GlyphPlacement {
    const circleRad = 5.0
    const circles = transduce(
        comp(
            // opentype to SVG string
            mapcat((letter) => font.getPath(letter, x, y, fontSize).toSVG()),
            // svg string to SAX events
            parseXML(), //
            // filter for path elements
            filter((ev) => ev.type === Type.ELEM_END && ev.tag === 'path'),
            // convert path strings to geom.Path objects
            mapcat((ev) => pathFromSvg(ev.attribs!.d)),
            // convert paths to polygons to vertices
            mapcat((path) => vertices(asPolygon(path), { dist: circleRad * 2 })),
            // convert vertices to circles
            map((p) => circle(p, circleRad))
        ),
        push<Circle>(),
        [letter]
    )
    return {
        letter,
        pos: [x, y],
        fontSize,
        circles,
    }
}

const ATTEMPTS = 2000
const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 256
const FONT_SIZE_STEP = 4
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 1200
// array containing 61-73 ascii characters
const characterSet = transduce(
    comp(
        flatten(),
        mapcat((char) => String.fromCharCode(char)) //
    ),
    push<string>(),
    // numbers, capital letters, lowercase letters
    [range(48, 57 + 1), range(65, 90 + 1), range(97, 122 + 1)]
)

const circleField: Circle[] = []
const placedGlyphs: GlyphPlacement[] = []
function canAddGlyph(glyph: GlyphPlacement): boolean {
    return glyph.circles.every((circle) => {
        return circleField.every((placed) => dist(circle.pos, placed.pos) > circle.r + placed.r)
    })
}

// pack them!
for (let i = 0; i < ATTEMPTS; i++) {
    // try to place one glyph
    const letter = pickRandom(characterSet)
    let x = Math.random() * CANVAS_WIDTH
    let y = Math.random() * CANVAS_HEIGHT
    let fontSize = MIN_FONT_SIZE

    let glyphPlacement: GlyphPlacement | undefined

    let glyphAttempt = createGlyphPlacement(letter, x, y, fontSize)
    while (canAddGlyph(glyphAttempt) && fontSize <= MAX_FONT_SIZE) {
        glyphPlacement = glyphAttempt

        // attempt to step it up
        fontSize += FONT_SIZE_STEP
        glyphAttempt = createGlyphPlacement(letter, x, y, fontSize)
    }

    // we're we able to place the glyph?
    if (glyphPlacement) {
        placedGlyphs.push(glyphPlacement)
        circleField.push(...glyphPlacement.circles)
    }
}

console.log('placed glyphs:', placedGlyphs.length)

// display them!
let svgContent = `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">`
svgContent += `<g fill="black">`
svgContent += transduce(
    map(({ letter, pos, fontSize }) => font.getPath(letter, pos[0], pos[1], fontSize).toSVG()),
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
