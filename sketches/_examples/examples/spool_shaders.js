import { Circle } from '../tools/geo'
import { color } from '../tools/color'
import { createGLCanvas, createOffscreenCanvas } from '../tools/canvas-utils'
import { draw } from '../tools/draw'

const vertShaderSource = `
attribute vec4 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = aPosition;
}
`
import fragShaderSource from './shaders/chroma_abs.frag?raw'

export function spoolShaders(ctx, palette) {
    const [bg, primary, secondary] = palette

    const w = ctx.canvas.width
    const h = ctx.canvas.height

    // replace existing canvas
    const canvasId = ctx.canvas.id
    ctx.canvas.parentNode.removeChild(ctx.canvas)

    const gl = createGLCanvas(w, h, canvasId)
    const shader = gl.loadShader(vertShaderSource, fragShaderSource)

    // draw something to an offscreen canvas
    const offCtx = createOffscreenCanvas(w, h)
    offCtx.setRange(-1, 1)
    offCtx.clear(bg)
    draw(offCtx, new Circle([0, 0], 0.5), { fill: primary })

    gl.clear(color(bg).toGLSL())
    gl.useShader(shader)

    gl.useTexture(gl.TEXTURE0, 'tex0', offCtx.canvas)

    gl.drawScreen()
}
