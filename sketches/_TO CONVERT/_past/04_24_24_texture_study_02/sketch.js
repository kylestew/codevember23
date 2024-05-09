import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen } from './util/gl-util.js'
import { createOffscreenCanvas } from './util/canvas-util.js'
import { Rect } from './tools/geom.js'
import { FillType, renderFill } from './tools/fills.js'

const w = 640
const h = 1020

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const colorSamplingCtx = createOffscreenCanvas(w, h)
const ctx = createOffscreenCanvas(w, h)

function draw() {
    ctx.background('#eee')
    colorSamplingCtx.background('#eee')

    // === Golden Ratio Rect ===
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const goldenRect = new Rect([0, 0], [1000 / goldenRatio, 1000])
    // split into 3 nested rects
    let [rect0, rect12] = goldenRect.split(1.0 / goldenRatio, true)
    let [rect1, rect2] = rect12.split(1.0 / goldenRatio, false)
    // rect0 = rect0.inset(10)
    // rect1 = rect1.inset(10)
    // rect2 = rect2.inset(10)

    // == Fill them with colors ===
    colorSamplingCtx.translate(10, 10)
    colorSamplingCtx.fillStyle = '#a10b2b'
    colorSamplingCtx.fill(rect0.path())
    colorSamplingCtx.fillStyle = '#b5d1cc'
    colorSamplingCtx.fill(rect1.path())
    colorSamplingCtx.fillStyle = '#000000'
    colorSamplingCtx.fill(rect2.path())

    // === FILL EXPLORATION ===
    // render fullscreen texture sampling underlying colors
    const fullRect = new Rect([0, 0], [w, h])
    ctx.fillStyle = '#22222214'
    ctx.strokeStyle = '#22222214'
    renderFill(ctx, fullRect, FillType.FIBERS, true, 0.6, 1.0, 1.2, 0.6, (pt) => {
        const [x, y] = pt
        const pixel = colorSamplingCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
        const [r, g, b, a] = pixel
        return `rgba(${r}, ${g}, ${b}, ${a / 3000})`
    })

    // == OUTPUT to SHADER ===
    glClear([0, 0, 0, 1])
    useShader(shader)
    useTexture(gl.TEXTURE0, 'tex', ctx.canvas)
    // useTexture(gl.TEXTURE0, 'tex', colorSamplingCtx.canvas)
    drawScreen()
}

draw()
