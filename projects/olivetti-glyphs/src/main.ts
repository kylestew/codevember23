import { parse as parseFont } from 'opentype.js'
import { parse as parseXML, Type } from '@thi.ng/sax'
import { pathFromSvg, asPolygon, vertices, circle, Circle, asSvg, svgDoc } from '@thi.ng/geom'
import { comp, mapcat, transduce, map, flatten, filter, push, range } from '@thi.ng/transducers'
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

const circleRad = 4

// one letter to circles
function circlesFromLetter(letter: string, x: number, y: number, fontSize: number): Circle[] {
    return transduce(
        comp(
            // opentype to SVG string
            mapcat((letter) => font.getPath(letter, x, y, fontSize).toSVG()),
            // svg string to SAX events
            parseXML(), //
            // filter for path elements
            filter((ev) => ev.type === Type.ELEM_END && ev.tag === 'path'),
            // convert path strings to geom.Path objects
            mapcat((ev) => pathFromSvg(ev.attribs!.d)),
            // convert paths to vertices
            mapcat((path) => vertices(asPolygon(path), { dist: circleRad * 2 })),
            // convert vertices to circles
            map((p) => circle(p, circleRad))
        ),
        push<Circle>(),
        [letter]
    )
}

class CirclePacker {
    width: number
    height: number

    // TODO: speed up using a data structure like a quadtree
    // Try and use a non-circle packing technique, GEOM has some intersection functions

    private items: Circle[] = []

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    private canAddCircle(circle: Circle): boolean {
        return this.items.every((item) => dist(circle.pos, item.pos) > circle.r + item.r)
    }

    canAddCircles(circles: Circle[]): boolean {
        for (const c of circles) {
            if (!this.canAddCircle(c)) {
                return false
            }
        }
        return true
    }

    add(circles: Circle[]): void {
        this.items.push(...circles)
    }
}

const ATTEMPTS = 8000
const MIN_FONT_SIZE = 24
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
    [range(48, 57 + 1), range(65, 90 + 1), range(97, 122 + 1)]
)

const circlePacker = new CirclePacker(CANVAS_WIDTH, CANVAS_HEIGHT)
type PlacedLetter = { letter: string; pos: Vec; fontSize: number }
const placedLetters: PlacedLetter[] = []

// pack them!
for (let i = 0; i < ATTEMPTS; i++) {
    // try to place one shape
    var fontSize = MIN_FONT_SIZE
    let x = Math.random() * CANVAS_WIDTH
    let y = Math.random() * CANVAS_HEIGHT

    // select random character from characterSet
    const letter = pickRandom(characterSet)
    let circles = circlesFromLetter(letter, x, y, fontSize)
    let placement: PlacedLetter | undefined

    while (circlePacker.canAddCircles(circles) && fontSize <= MAX_FONT_SIZE) {
        placement = { letter, pos: [x, y], fontSize }

        // attempt to step it up
        fontSize += FONT_SIZE_STEP
        circles = circlesFromLetter(letter, x, y, fontSize)
    }

    // we're we able to place the letter?
    if (placement) {
        circlePacker.add(circles)
        placedLetters.push(placement)
    }
}

// display them!
const svgPathElements = transduce(
    map(({ letter, pos, fontSize }) => font.getPath(letter, pos[0], pos[1], fontSize).toSVG()),
    push(),
    placedLetters
)
console.log('placed', svgPathElements.length, 'letters')

// wrap path elements in SVG doc
let svgStart = `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">`
let svgEnd = `</svg>`
let svgPaths = svgPathElements.join('\n')
let svgContent = `${svgStart}\n${svgPaths}\n${svgEnd}`

document.body.innerHTML = svgContent
