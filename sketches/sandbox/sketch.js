import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen } from './gl-util.js'
import { createOffscreenCanvas } from './canvas-util.js'

const w = 1080
const h = 1500

createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const offCtx = createOffscreenCanvas(w, h)

function draw() {
    // Draw something on the offscreen canvas
    offCtx.fillStyle = 'green'
    offCtx.fillRect(0, 0, 256, 256)
    offCtx.fillStyle = 'red'
    offCtx.fillRect(10, 10, 100, 100)

    glClear([0, 0, 0, 1])

    useShader(shader)

    useTexture('uSampler', offCtx.canvas)

    drawScreen()
}
draw()
