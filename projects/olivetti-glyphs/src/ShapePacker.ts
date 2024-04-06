import { Rect, rect, intersects } from '@thi.ng/geom'
import { IntersectionType } from '@thi.ng/geom-api'
import { ceil, floor, mulN } from '@thi.ng/vectors'

export class ShapePacker {
    private domainBounds: Rect

    private scale: number
    private downscaleWidth: number
    private downscaleHeight: number

    private packedCanvas: OffscreenCanvas
    private packedCtx: OffscreenCanvasRenderingContext2D
    private glyphCanvas: OffscreenCanvas
    private glyphCtx: OffscreenCanvasRenderingContext2D
    private compareCanvas: OffscreenCanvas
    private compareCtx: OffscreenCanvasRenderingContext2D

    constructor(width: number, height: number, downscale: number = 4) {
        this.domainBounds = rect([0, 0], [width, height])

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

    canPlaceShape(bounds: Rect, renderCallback: (ctx: OffscreenCanvasRenderingContext2D) => void): boolean {
        // don't bother checking if the bounds are outside the domain
        // (in original domain size)
        if (intersects(this.domainBounds, bounds).type == IntersectionType.NONE) {
            // console.log('MISSED', this.domainBounds, bounds, intersects(this.domainBounds, bounds))
            return false
        }

        // Call the provided render callback to draw the glyph on glyphCtx
        this.glyphCtx.clearRect(0, 0, this.domainBounds.size[0], this.domainBounds.size[1])
        renderCallback(this.glyphCtx)

        // Prepare compareCtx by drawing packedCanvas, setting blend mode, then drawing glyphCanvas
        this.compareCtx.clearRect(0, 0, this.domainBounds.size[0], this.domainBounds.size[1]) // Ensure compareCtx is clear
        this.compareCtx.globalCompositeOperation = 'source-over'
        this.compareCtx.drawImage(this.packedCanvas, 0, 0)
        this.compareCtx.globalCompositeOperation = 'source-in'
        this.compareCtx.drawImage(this.glyphCanvas, 0, 0)

        // Read back the pixels from comparCtx to check for non-zero pixels
        // We only need to read withing the bounds of the newly rendered area
        // grow those bounds a bit to ensure no issues with antialiasing
        bounds.offset(2)
        // // bounds = this.domainBounds
        const pos = floor([], mulN([], bounds.pos, this.scale))
        const size = ceil([], mulN([], bounds.size, this.scale))
        const imageData: ImageData = this.compareCtx.getImageData(pos[0], pos[1], size[0], size[1])
        // const imageData: ImageData = this.compareCtx.getImageData(0, 0, this.downscaleWidth, this.downscaleHeight)
        const data: Uint8ClampedArray = imageData.data
        // console.log(
        //     this.compareCanvas.width,
        //     this.compareCanvas.height,
        //     this.downscaleWidth,
        //     this.downscaleHeight,
        //     data.length
        // )
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0 || data[i + 3] > 0) {
                return false
            }
        }
        return true
    }

    commitShape(renderCallback: (ctx: OffscreenCanvasRenderingContext2D) => void): void {
        renderCallback(this.packedCtx)
    }

    test() {
        const rectA = new Rect([10, 10], [20, 20])
        let result = this.canPlaceShape(rectA, (ctx: OffscreenCanvasRenderingContext2D) => {
            console.log('drawing rectA')
            ctx.fillRect(rectA.pos[0], rectA.pos[1], rectA.size[0], rectA.size[1])
        })
        if (result) {
            this.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
                console.log('committing rectA')
                ctx.fillRect(rectA.pos[0], rectA.pos[1], rectA.size[0], rectA.size[1])
            })
        }

        const rectB = new Rect([20, 20], [20, 20])
        result = this.canPlaceShape(rectB, (ctx: OffscreenCanvasRenderingContext2D) => {
            console.log('drawing rectB')
            ctx.fillRect(rectB.pos[0], rectB.pos[1], rectB.size[0], rectB.size[1])
        })
        console.log(result, 'should be false')
        if (result) {
            this.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
                console.log('committing rectB')
                ctx.fillRect(rectB.pos[0], rectB.pos[1], rectB.size[0], rectB.size[1])
            })
        }
    }

    dumpToCanvas(canvas: HTMLCanvasElement, whichOne: string) {
        // size the canvas for display
        canvas.width = this.downscaleWidth
        canvas.height = this.downscaleHeight
        if (whichOne == 'glyph') {
            console.log('render glyph canvas')
            canvas.getContext('2d')!.drawImage(this.glyphCanvas, 0, 0)
        } else if (whichOne == 'packed') {
            canvas.getContext('2d')!.drawImage(this.packedCanvas, 0, 0)
        } else {
            canvas.getContext('2d')!.drawImage(this.compareCanvas, 0, 0)
        }
    }
}
