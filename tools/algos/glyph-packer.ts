// import { GlyphMaker } from './GlyphMaker'
// import { Rect, rect, intersects, bounds, rotate, scale, translate } from '@thi.ng/geom'
// import { IntersectionType } from '@thi.ng/geom-api'
// import { ceil, floor, mulN } from '@thi.ng/vectors'
// import { draw } from '@thi.ng/hiccup-canvas'

// import { Path } from '@thi.ng/geom'
// import { Vec } from '@thi.ng/vectors'

// export interface Glyph {
//     path: Path2D

//     position: [number, number]
//     scale: number
//     rotation: number

//     hollow: boolean
// }

// export class GlyphPacker {
//     public packer: CanvasPacker
//     public padding: number = 0

//     public glyphMakers: GlyphMaker[] = []

//     constructor(width: number, height: number, glyphPadding: number = 2, downscale: number = 1) {
//         this.packer = new CanvasPacker(width, height, downscale)
//         this.padding = glyphPadding
//     }

//     /// Attempts to place one glyph, returns it if successful
//     /// Uses the glyph makers in order, trying to fulfill their rules
//     /// returns FALSE if packing rules are completed
//     next(): Glyph | boolean {
//         if (this.glyphMakers.length === 0) {
//             // nothing left to do
//             console.log('PACKING COMPLETE!')
//             return false
//         }

//         // do we still have attempts to make?
//         const maker = this.glyphMakers[0]
//         if (maker.attempts === 0 || maker.count === 0) {
//             // remove Maker - will not be available on next iteration
//             this.glyphMakers.shift()
//         }
//         let glyph = maker.make()
//         maker.attempts--

//         const transformGlyph = (glyph: Glyph) => {
//             return translate(rotate(scale(glyph.path, glyph.scale), glyph.rotation), glyph.position)
//         }
//         const glyphCanvasRenderer = (ctx: OffscreenCanvasRenderingContext2D) => {
//             const fill = glyph.hollow ? '#0000' : '#000'
//             draw(ctx, [
//                 'g',
//                 { fill, stroke: '#000', lineJoin: 'round', lineCap: 'round', weight: this.padding },
//                 transformGlyph(glyph),
//             ])
//         }

//         let placedGlyph: Glyph | undefined = undefined
//         while (
//             glyph.scale <= maker.scaleRange[1] &&
// TODO: apply padding by offsetting bounds here, removed from packer
//             this.packer.canPlaceShape(bounds(transformGlyph(glyph)) as Rect, glyphCanvasRenderer)
//         ) {
//             placedGlyph = { ...glyph }
//             // attempt to step it up
//             glyph.scale += maker.scaleStepSize
//         }

//         if (placedGlyph !== undefined) {
//             // copy it back in place
//             glyph = { ...placedGlyph }
//             this.packer.commitShape(glyphCanvasRenderer)
//             maker.count--

//             return placedGlyph
//         }
//         return true
//     }
// }

import { Rectangle } from '../geo/shapes'
import { mulN, floor, ceil } from '../math/vectors'

/// Uses actual pixel data to determine if a shape can be placed
/// Manages several canvases to do this (packed, glyph, compare)
/// (1) A new candidate shape is drawn on the glyph canvas
/// (2) The packed canvas is drawn to the compare canvas using (source-over) blend mode
/// (3) If the compare canvas has any non-zero pixels, the shape overlaps and cannot be placed
///
/// TODO: candidate for speed up using WebGL and smarter pixel reading (dirty rect)
export class CanvasPacker {
    private domainBounds: Rectangle

    private scale: number
    private downscaleWidth: number
    private downscaleHeight: number

    private packedCanvas: OffscreenCanvas
    private packedCtx: OffscreenCanvasRenderingContext2D
    private glyphCanvas: OffscreenCanvas
    private glyphCtx: OffscreenCanvasRenderingContext2D
    private compareCanvas: OffscreenCanvas
    private compareCtx: OffscreenCanvasRenderingContext2D

    constructor(width: number, height: number, downscale: number = 1) {
        this.domainBounds = new Rectangle([0, 0], [width, height])

        this.scale = 1.0 / downscale
        this.downscaleWidth = Math.floor(width / downscale)
        this.downscaleHeight = Math.floor(height / downscale)

        this.packedCanvas = new OffscreenCanvas(this.downscaleWidth, this.downscaleHeight)
        this.packedCtx = this.packedCanvas.getContext('2d')!
        // apply scale so drawing is correct
        this.packedCtx.scale(this.scale, this.scale)

        this.glyphCanvas = new OffscreenCanvas(this.downscaleWidth, this.downscaleHeight)
        this.glyphCtx = this.glyphCanvas.getContext('2d')!
        this.glyphCtx.scale(this.scale, this.scale)

        this.compareCanvas = new OffscreenCanvas(this.downscaleWidth, this.downscaleHeight)
        this.compareCtx = this.compareCanvas.getContext('2d', { willReadFrequently: true })!
        // DO NOT SCALE THIS CANVAS CONTEXT (its drawing pre-scaled content)
    }

    canPlaceShape(bounds: Rectangle, renderCallback: (ctx: OffscreenCanvasRenderingContext2D) => void): boolean {
        // don't bother checking if the bounds are outside the domain
        // (in original domain size)
        // if (intersects(this.domainBounds, bounds).type == IntersectionType.NONE) {
        //     // console.log('MISSED', this.domainBounds, bounds, intersects(this.domainBounds, bounds))
        //     return false
        // }

        // Call the provided render callback to draw the glyph on glyphCtx
        this.glyphCtx.clearRect(0, 0, this.domainBounds.size[0], this.domainBounds.size[1])
        console.log(renderCallback)
        renderCallback(this.glyphCtx)

        // Prepare compareCtx by drawing packedCanvas, setting blend mode, then drawing glyphCanvas
        // this.compareCtx.clearRect(0, 0, this.domainBounds.size[0], this.domainBounds.size[1]) // Ensure compareCtx is clear
        // this.compareCtx.globalCompositeOperation = 'source-over'
        // this.compareCtx.drawImage(this.packedCanvas, 0, 0)
        // this.compareCtx.globalCompositeOperation = 'source-in'
        // this.compareCtx.drawImage(this.glyphCanvas, 0, 0)

        // // Read back the pixels from comparCtx to check for non-zero pixels
        // // We only need to read withing the bounds of the newly rendered area
        // // grow those bounds a bit to ensure no issues with antialiasing
        // // console.log('CANVAS PACKER: not optimized at all currently, scaled? ', this.scale)
        // // bounds = this.domainBounds
        // const pos = floor(mulN(bounds.pos, this.scale))
        // const size = ceil(mulN(bounds.size, this.scale))
        // // console.log('CANVAS PACKER: bounds', bounds, 'pos', pos, 'size', size)
        // const imageData: ImageData = this.compareCtx.getImageData(pos[0], pos[1], size[0], size[1])
        // // const imageData: ImageData = this.compareCtx.getImageData(0, 0, this.downscaleWidth, this.downscaleHeight)
        // const data: Uint8ClampedArray = imageData.data
        // // console.log(
        // //     this.compareCanvas.width,
        // //     this.compareCanvas.height,
        // //     this.downscaleWidth,
        // //     this.downscaleHeight,
        // //     data.length
        // // )
        // for (let i = 0; i < data.length; i += 4) {
        //     if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0 || data[i + 3] > 0) {
        //         return false
        //     }
        // }
        return true
    }

    commitShape(renderCallback: (ctx: OffscreenCanvasRenderingContext2D) => void): void {
        renderCallback(this.packedCtx)
    }

    // test() {
    //     const rectA = new Rect([10, 10], [20, 20])
    //     let result = this.canPlaceShape(rectA, (ctx: OffscreenCanvasRenderingContext2D) => {
    //         console.log('drawing rectA')
    //         ctx.fillRect(rectA.pos[0], rectA.pos[1], rectA.size[0], rectA.size[1])
    //     })
    //     if (result) {
    //         this.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
    //             console.log('committing rectA')
    //             ctx.fillRect(rectA.pos[0], rectA.pos[1], rectA.size[0], rectA.size[1])
    //         })
    //     }

    //     const rectB = new Rect([20, 20], [20, 20])
    //     result = this.canPlaceShape(rectB, (ctx: OffscreenCanvasRenderingContext2D) => {
    //         console.log('drawing rectB')
    //         ctx.fillRect(rectB.pos[0], rectB.pos[1], rectB.size[0], rectB.size[1])
    //     })
    //     console.log(result, 'should be false')
    //     if (result) {
    //         this.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
    //             console.log('committing rectB')
    //             ctx.fillRect(rectB.pos[0], rectB.pos[1], rectB.size[0], rectB.size[1])
    //         })
    //     }
    // }

    /**
     * Dumps the specified canvas to a debug canvas element on the page.
     * It either updates an existing debug canvas or creates a new one if not present.
     *
     * @param {('glyph' | 'packed' | 'compare')} whichOne - Specifies which canvas to display for debugging.
     */
    dumpDebugCanvas(whichOne: 'glyph' | 'packed' | 'compare') {
        // Attempt to find an existing debug canvas
        let canvas = document.getElementById('mainCanvas') as HTMLCanvasElement
        if (!canvas) {
            // Create a new canvas element if it does not exist
            canvas = document.createElement('canvas') as HTMLCanvasElement
            canvas.id = 'debugCanvas'
            document.body.appendChild(canvas)
        }

        // Set the size of the canvas for display
        canvas.width = this.downscaleWidth
        canvas.height = this.downscaleHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return // If the context is not available, exit the function

        // Clear the canvas with a white background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Choose the source canvas to draw from based on the argument
        if (whichOne === 'glyph') {
            ctx.drawImage(this.glyphCanvas, 0, 0)
        } else if (whichOne === 'packed') {
            ctx.drawImage(this.packedCanvas, 0, 0)
        } else {
            ctx.drawImage(this.compareCanvas, 0, 0)
        }
    }
}
