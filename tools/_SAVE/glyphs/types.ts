import { Path } from '@thi.ng/geom'
import { Vec } from '@thi.ng/vectors'

export interface Glyph {
    path: Path

    position: Vec
    scale: number
    rotation: number

    hollow: boolean
}
