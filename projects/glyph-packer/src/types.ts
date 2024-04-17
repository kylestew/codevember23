import { Font } from 'opentype.js'

export type SketchParams = {
    fonts: Font[]
    characterSet: string[]
    canvasSize: { width: number; height: number }

    density: number
    padding: number
}

export type Color = { r: number; g: number; b: number; a: number }
