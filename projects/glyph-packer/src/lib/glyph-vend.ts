import { SketchParams } from '../types'
import { pickRandom } from '@thi.ng/random'
import { transduce, pluck, trace, flatten, map, mapcat, filter, push, comp } from '@thi.ng/transducers'
import { Path, path, pathFromSvg, centroid, bounds, translate } from '@thi.ng/geom'
import { PathSegment } from '@thi.ng/geom-api'
import { Vec } from '@thi.ng/vectors'
import { Font } from 'opentype.js'

export interface Glyph {
    path: Path

    position: Vec
    scale: number
    // rotation: number

    hollow: boolean // or stroke if false
}

export interface GlyphMaker {
    progress: number

    minScale: number
    maxScale: number
    scaleStepSize: number

    placementRule: () => Vec
    hollowRule: () => boolean

    make(): Glyph
}

export class FontGlyphMaker implements GlyphMaker {
    progress: number

    minScale: number
    maxScale: number
    scaleStepSize: number

    placementRule: () => Vec
    hollowRule: () => boolean

    fontSet: Font[]
    characterSet: string[]

    constructor(
        progress: number,
        minScale: number,
        maxScale: number,
        scaleStepSize: number,
        fontSet: Font[],
        characterSet: string[],
        placementRule: () => Vec,
        hollowRule: () => boolean
    ) {
        this.progress = progress
        this.fontSet = fontSet
        this.characterSet = characterSet
        this.minScale = minScale
        this.maxScale = maxScale
        this.scaleStepSize = scaleStepSize
        this.placementRule = placementRule
        this.hollowRule = hollowRule
    }

    make(): Glyph {
        const font = pickRandom(this.fontSet)
        const letter = pickRandom(this.characterSet)

        const segments = transduce(
            comp(
                // opentype to SVG string
                map((letter) => font.getPath(letter, 0, 0, 64.0).toPathData(4)),
                // trace(),
                // convert path string to geom.Path objects
                mapcat((d) => pathFromSvg(d)),
                // trace(),
                // flatten segments
                mapcat((path) => path.segments)
                // trace()
            ),
            push<PathSegment>(),
            [letter]
        )

        // center the path on itself
        let centeredPath = path(segments)
        const cent = centroid(bounds(centeredPath))
        centeredPath = translate(centeredPath, [-cent[0], -cent[1]]) as Path

        return {
            path: centeredPath,

            position: this.placementRule(),
            scale: this.minScale,
            // rotation: 0,
            hollow: this.hollowRule(),
        }
    }
}
