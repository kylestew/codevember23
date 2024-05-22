import { Path, circle, pathFromSvg, asPath, translate, scale } from '@thi.ng/geom'
import { transduce, comp, filter, mapcat, map, push } from '@thi.ng/transducers'
import { parse as parseXML, Type } from '@thi.ng/sax'

/**
 * Converts SVG data into an array of Path objects.
 * SVG needs to be in a space of [0, 1000] and simple shapes
 *
 * @param svgData - The SVG data to be converted.
 * @returns An array of Path objects representing the SVG data.
 */
function svgToPaths(svgData: string): Path[] {
    return transduce(
        comp(
            // test -> SAX
            parseXML(),
            // filter all groups - each group is a shape layer
            filter(
                (ev) => ev.type === Type.ELEM_END && (ev.tag === 'path' || ev.tag === 'rect' || ev.tag === 'circle')
            ),
            // convert to Path object
            mapcat((ev) => {
                switch (ev.tag) {
                    case 'rect':
                        const { x, y, width, height } = ev.attribs

                        // Convert strings to numbers
                        const xNum = Number(x)
                        const yNum = Number(y)
                        const widthNum = Number(width)
                        const heightNum = Number(height)

                        // Construct the path string using numeric calculations
                        return pathFromSvg(
                            `M${xNum},${yNum} H${xNum + widthNum} V${yNum + heightNum} H${xNum} V${yNum} Z`
                        )

                    case 'circle':
                        const { cx, cy, r } = ev.attribs

                        // Convert strings to numbers
                        const cxNum = Number(cx)
                        const cyNum = Number(cy)
                        const radiusNum = Number(r)

                        return [asPath(circle([cxNum, cyNum], radiusNum))]

                    default:
                        return pathFromSvg(ev.attribs!.d)
                }
            }),
            // scale to unit size
            map((path) => translate(scale(path, 0.001), [-0.5, -0.5]) as Path)
            // trace()
        ),
        push<Path>(),
        svgData
    )
}
