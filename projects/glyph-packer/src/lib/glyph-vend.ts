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
    rotation: number

    hollow: boolean
}

export abstract class GlyphMaker {
    progress: number

    minScale: number
    maxScale: number
    scaleStepSize: number

    placementRule: () => Vec
    rotationRule: () => number
    hollowRule: () => boolean

    constructor(
        progress: number,
        minScale: number,
        maxScale: number,
        scaleStepSize: number,
        placementRule: () => Vec,
        rotationRule: () => number,
        hollowRule: () => boolean
    ) {
        this.progress = progress
        this.minScale = minScale
        this.maxScale = maxScale
        this.scaleStepSize = scaleStepSize
        this.placementRule = placementRule
        this.rotationRule = rotationRule
        this.hollowRule = hollowRule
    }

    abstract randomPath(): Path

    make(): Glyph {
        const path = this.randomPath()

        return {
            path: path,
            position: this.placementRule(),
            scale: this.minScale,
            rotation: this.rotationRule(),
            hollow: this.hollowRule(),
        }
    }
}

export class ShapeGlyphMaker extends GlyphMaker {
    shapeSet: Path[]

    constructor(
        progress: number,
        minScale: number,
        maxScale: number,
        scaleStepSize: number,
        shapeSet: Path[],
        placementRule: () => Vec,
        rotationRule: () => number,
        hollowRule: () => boolean
    ) {
        super(progress, minScale, maxScale, scaleStepSize, placementRule, rotationRule, hollowRule)
        this.shapeSet = shapeSet
    }

    randomPath(): Path {
        return pickRandom(this.shapeSet)
    }
}

export class FontGlyphMaker extends GlyphMaker {
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
        rotationRule: () => number,
        hollowRule: () => boolean
    ) {
        super(progress, minScale, maxScale, scaleStepSize, placementRule, rotationRule, hollowRule)
        this.fontSet = fontSet
        this.characterSet = characterSet
    }

    randomPath(): Path {
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
        return translate(centeredPath, [-cent[0], -cent[1]]) as Path
    }
}
