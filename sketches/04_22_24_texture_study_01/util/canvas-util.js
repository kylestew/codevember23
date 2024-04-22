export function createOffscreenCanvas(width, height) {
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const offCtx = offscreenCanvas.getContext('2d')

    offCtx.fillStyle = 'black'
    offCtx.fillRect(0, 0, width, height)

    return offCtx
}

// EVIL MONKEY PATCHING IN SOME METHODS
if (typeof OffscreenCanvasRenderingContext2D.prototype.background === 'undefined') {
    OffscreenCanvasRenderingContext2D.prototype.background = function (color) {
        this.fillStyle = color
        this.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
