import { parse as parseFont } from 'opentype.js'
import { parse as parseXML, Type } from '@thi.ng/sax'
import { pathFromSvg, asPolygon, vertices, circle, Circle, asSvg, svgDoc } from '@thi.ng/geom'
import { comp, mapcat, transduce, map, filter, push } from '@thi.ng/transducers'

import fontFileURL from './assets/FiraSansOT-Medium.otf?url'

async function loadFont() {
    const response = await fetch(fontFileURL)
    const buffer = await response.arrayBuffer()
    const font = parseFont(buffer)
    return font
}

const font = await loadFont()

const circleRad = 5

// one letter to circles
function circlesFromLetter(letter: string, fontSize: number): Circle[] {
    return transduce(
        comp(
            // opentype to SVG string
            mapcat((letter) => font.getPath(letter, 0, 0, 256).toSVG()),
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

const circles = circlesFromLetter('A', 256)
console.log(circles)
document.body.innerHTML = asSvg(svgDoc({ stroke: 'blue' }, ...circles))
