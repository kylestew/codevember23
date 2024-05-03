import { Glyph } from './types'
import { Path } from '@thi.ng/geom'
import { Vec } from '@thi.ng/vectors'

export abstract class GlyphMaker {
    count: number // goal placement count
    attempts: number // attempts to reach goal

    minScale: number
    maxScale: number
    scaleStepSize: number

    placementRule: () => Vec
    rotationRule: () => number
    hollowRule: () => boolean

    constructor(
        count: number,
        attempts: number,

        minScale: number,
        maxScale: number,
        scaleStepSize: number,
        placementRule: () => Vec,
        rotationRule: () => number,
        hollowRule: () => boolean
    ) {
        this.count = count
        this.attempts = attempts

        this.minScale = minScale
        this.maxScale = maxScale
        this.scaleStepSize = scaleStepSize
        this.placementRule = placementRule
        this.rotationRule = rotationRule
        this.hollowRule = hollowRule
    }

    /// Child implements this and vends a path to be used in packing
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
