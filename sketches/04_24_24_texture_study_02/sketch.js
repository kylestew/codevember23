import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen } from './util/gl-util.js'
import { createOffscreenCanvas } from './util/canvas-util.js'
import { Rect } from './tools/geom.js'
import { FillType, renderFill } from './tools/fills.js'

const w = 640
const h = 1020

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const ctx = createOffscreenCanvas(w, h)

function draw() {
    ctx.background('#eee')

    ctx.fillStyle = '#22222214'
    ctx.strokeStyle = '#22222214'

    // === Golden Ratio Rect ===
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const goldenRect = new Rect([0, 0], [1000 / goldenRatio, 1000])
    // split into 3 nested rects
    let [rect0, rect12] = goldenRect.split(1.0 / goldenRatio, true)
    let [rect1, rect2] = rect12.split(1.0 / goldenRatio, false)
    rect0 = rect0.inset(10)
    rect1 = rect1.inset(10)
    rect2 = rect2.inset(10)
    // rect2 = new Rect([0, 0], [300, 20])

    // === How to fill a shape with texture ===
    // (1) use the shape as a cliping mask
    // (2) draw the texture into a rect containing the clipping mask

    // === FILL EXPLORATION ===
    ctx.translate(10, 10)

    ctx.save()
    ctx.clip(rect0.path())
    renderFill(ctx, rect0, FillType.FIBERS, true, 0.2, 1.0, 1.5, 0.5)
    ctx.restore()

    ctx.save()
    ctx.clip(rect1.path())
    renderFill(ctx, rect1, FillType.FIBERS, true, 0.5, 0.5, 0.5, 0.25)
    ctx.restore()

    ctx.save()
    ctx.clip(rect2.path())
    renderFill(ctx, rect2, FillType.FIBERS, true, 0.8, 0.8, 0.5, 0.05)
    ctx.restore()

    // == OUTPUT to SHADER ===
    glClear([0, 0, 0, 1])
    useShader(shader)
    useTexture(gl.TEXTURE0, 'tex', ctx.canvas)
    drawScreen()
}

draw()
