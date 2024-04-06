

````
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
````