import { createGLCanvas } from '../../tools/canvas-utils'

import vertShaderSource from './shaders/basic.vert?raw'
import fragShaderSource from './shaders/light_shadow_2d.frag?raw'

export function fragShaderSandbox(ctx, palette) {
    const [bg, primary, secondary] = palette

    // replace canvas with a webgl context version
    const gl = createGLCanvas(ctx.canvas.width, ctx.canvas.height, ctx.canvas.id)
    const shader = gl.loadShader(vertShaderSource, fragShaderSource)

    gl.clear('rbga(0, 0, 0, 1)')
    gl.useShader(shader)
    gl.drawScreen()
}
