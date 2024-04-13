import { BoundingBox, Font } from 'opentype.js'
import { Rect } from '@thi.ng/geom'
import { transduce, map, push } from '@thi.ng/transducers'
import { pickRandom } from '@thi.ng/random'
import { Vec } from '@thi.ng/vectors'

import { alphaNumericCharacterSet } from './glyph-sets'
import { loadFontSet } from './font-set'
import { ShapePacker } from './lib/ShapePacker'
import { ProgressCallback } from './gui'

const fonts = await loadFontSet()
// const characterSet = 'Speak softly and carry a big stick'.split('')
// array containing 61-73 ascii characters
const characterSet = alphaNumericCharacterSet

type GlyphPlacement = { font: Font; letter: string; pos: Vec; fontSize: number }
export type AppParams = {
    canvasSize: { width: number; height: number }
    density: number
}

function asRect(bounds: BoundingBox): Rect {
    return new Rect([bounds.x1, bounds.y1], [bounds.x1 + bounds.x2, bounds.y1 + bounds.y2])
}

export class App {
    packer: ShapePacker
    placedGlyphs: GlyphPlacement[] = []

    private outputElm: HTMLElement
    private width: number
    private height: number

    private forceStop = false
    private attempts: number

    // TODO: bring these in as params
    private minFontSize = 16
    private maxFontSize = 328
    private fontStepSize = 4
    private strokePadding = 2

    constructor(params: AppParams, outputElm: HTMLElement) {
        this.width = params.canvasSize.width
        this.height = params.canvasSize.height
        this.packer = new ShapePacker(params.canvasSize.width, params.canvasSize.height, 1)
        this.outputElm = outputElm

        this.attempts = params.density * 10000 // [0,1] -> [0, 10000]
    }

    display() {
        let svgContent = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">`
        // svgContent += `<g fill="black">`
        svgContent += `<g fill="none" stroke="red" stroke-width="1">`
        svgContent += transduce(
            map(({ font, letter, pos, fontSize }) => font.getPath(letter, pos[0], pos[1], fontSize).toSVG()),
            push(),
            this.placedGlyphs
        ).join('\n')
        svgContent += `</g>`
        svgContent += `</svg>`
        this.outputElm.innerHTML = svgContent
    }

    stop() {
        this.forceStop = true
    }

    async start(progressCallback: ProgressCallback) {
        let changesMade = false
        for (let i = 0; i < this.attempts; i++) {
            // try to place one glyph
            const font = pickRandom(fonts)
            const letter = pickRandom(characterSet)
            // // TODO: gaussian distribution centered aroudn the middle of the canvas
            let x = Math.random() * this.width * 1.2 - this.width * 0.1
            let y = Math.random() * this.width * 1.2
            let fontSize = this.minFontSize
            let path = font.getPath(letter, x, y, fontSize)

            let placedGlyph: GlyphPlacement | undefined
            while (
                fontSize <= this.maxFontSize &&
                this.packer.canPlaceShape(asRect(path.getBoundingBox()), (ctx: OffscreenCanvasRenderingContext2D) => {
                    ctx.lineWidth = this.strokePadding
                    path.draw(ctx)
                    if (this.strokePadding > 0) ctx.stroke() // adds a stroke to space out glyphs
                })
            ) {
                placedGlyph = {
                    font,
                    letter,
                    pos: [x, y],
                    fontSize,
                }
                // attempt to step it up
                fontSize += this.fontStepSize
                path = font.getPath(letter, x, y, fontSize)
            }

            // // we're we able to place the glyph?
            if (placedGlyph) {
                this.placedGlyphs.push(placedGlyph)

                // draw to packed canvas buffer
                this.packer.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
                    const path = placedGlyph.font.getPath(
                        placedGlyph.letter,
                        placedGlyph.pos[0],
                        placedGlyph.pos[1],
                        placedGlyph.fontSize
                    )
                    ctx.lineWidth = this.strokePadding
                    path.draw(ctx)
                    if (this.strokePadding > 0) ctx.stroke() // adds a stroke to space out glyphs
                })
                changesMade = true
            }

            if (changesMade) {
                changesMade = false
                this.display()
            }

            // update progress
            progressCallback((i + 1) / this.attempts, false)

            // Pause for a short time (e.g., 100 milliseconds)
            // This allows the browser to update the UI
            await new Promise((resolve) => setTimeout(resolve, 1))
            if (this.forceStop) {
                break
            }
        }
        progressCallback(1, true)
    }
}
