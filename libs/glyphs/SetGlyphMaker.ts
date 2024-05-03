import { GlyphMaker } from './GlyphMaker'
import { Path, path } from '@thi.ng/geom'
import { Vec } from '@thi.ng/vectors'
import { pickRandom } from '@thi.ng/random'

/// Takes a set of paths and vends them as glyphs
export class SetGlyphMaker extends GlyphMaker {
    pathSet: Path[] | (() => Path)[]

    constructor(
        count: number,
        attempts: number,

        minScale: number,
        maxScale: number,
        scaleStepSize: number,
        pathSet: Path[],
        placementRule: () => Vec,
        rotationRule: () => number,
        hollowRule: () => boolean
    ) {
        super(count, attempts, minScale, maxScale, scaleStepSize, placementRule, rotationRule, hollowRule)
        this.pathSet = pathSet
    }

    randomPath(): Path {
        const pathOrFn = pickRandom(this.pathSet)
        if (pathOrFn instanceof Function) {
            return pathOrFn()
        }
        return pathOrFn
    }
}
