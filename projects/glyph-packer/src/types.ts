import { Font } from 'opentype.js'
import { Path } from '@thi.ng/geom'

export type SketchParams = {
    fonts: Font[]
    characterSet: string[]
    canvasSize: { width: number; height: number }

    shapeSet: Path[]

    padding: number
}

export type Color = { r: number; g: number; b: number; a: number }
