export { createCanvas, createOffscreenCanvas, setCanvasRange } from './canvas-util'
export { createGLCanvas, glClear, loadShader, useShader, useTexture, drawScreen } from './gl-util'

// EVIL MONKEY PATCHING IN SOME METHODS
declare global {
    interface CanvasRenderingContext2D {
        background(color: string): void
    }
}

declare global {
    interface OffscreenCanvasRenderingContext2D {
        background(color: string): void
    }
}

CanvasRenderingContext2D.prototype.background = function (color: string) {
    this.fillStyle = color
    this.fillRect(0, 0, this.canvas.width, this.canvas.height)
}

OffscreenCanvasRenderingContext2D.prototype.background = function (color: string) {
    this.fillStyle = color
    this.fillRect(0, 0, this.canvas.width, this.canvas.height)
}
