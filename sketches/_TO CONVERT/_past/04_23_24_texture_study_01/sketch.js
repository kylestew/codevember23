import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen } from './util/gl-util.js'
import { createOffscreenCanvas } from './util/canvas-util.js'
import { Rect } from './tools/geom.js'
import { FillType, renderFill } from './tools/fills.js'

const w = 3200
const h = 1020

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const ctx = createOffscreenCanvas(w, h)

function draw() {
    ctx.background('#eee')

    ctx.fillStyle = '#22222204'
    ctx.strokeStyle = '#22222204'

    // === Golden Ratio Rect ===
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const goldenRect = new Rect([0, 0], [1000 / goldenRatio, 1000])
    // split into 3 nested rects
    let [rect0, rect12] = goldenRect.split(1.0 / goldenRatio, true)
    let [rect1, rect2] = rect12.split(1.0 / goldenRatio, false)
    rect0 = rect0.inset(10)
    rect1 = rect1.inset(10)
    rect2 = rect2.inset(10)

    // === How to fill a shape with texture ===
    // (1) use the shape as a cliping mask
    // (2) draw the texture into a rect containing the clipping mask

    // === FILL EXPLORATION ===
    // (1) Random Polys
    ctx.translate(10, 10)
    ctx.save()
    ctx.clip(rect0.path())
    renderFill(ctx, rect0, FillType.BLOBS, false, 0.2, 0.3, 30, 15)
    ctx.restore()

    ctx.save()
    ctx.clip(rect1.path())
    renderFill(ctx, rect1, FillType.BLOBS, false, 0.5, 0.2, 20, 10)
    ctx.restore()

    ctx.save()
    ctx.clip(rect2.path())
    renderFill(ctx, rect2, FillType.BLOBS, false, 0.8, 0.1, 10, 5)
    ctx.restore()

    // (2) Random Polys - Stroked
    ctx.translate(640, 0)
    ctx.save()
    ctx.clip(rect0.path())
    renderFill(ctx, rect0, FillType.BLOBS, true, 0.2, 0.3, 30, 15)
    ctx.restore()

    ctx.save()
    ctx.clip(rect1.path())
    renderFill(ctx, rect1, FillType.BLOBS, true, 0.5, 0.2, 20, 10)
    ctx.restore()

    ctx.save()
    ctx.clip(rect2.path())
    renderFill(ctx, rect2, FillType.BLOBS, true, 0.8, 0.1, 10, 5)
    ctx.restore()

    // (3) Lines
    ctx.translate(640, 0)
    ctx.save()
    ctx.clip(rect0.path())
    renderFill(ctx, rect0, FillType.LINES, true, 0.2, 0.3, 1, 0.5)
    ctx.restore()

    ctx.save()
    ctx.clip(rect1.path())
    renderFill(ctx, rect1, FillType.LINES, true, 0.5, 0.2, 1, 0.5)
    ctx.restore()

    ctx.save()
    ctx.clip(rect2.path())
    renderFill(ctx, rect2, FillType.LINES, true, 0.8, 0.1, 1, 0.5)
    ctx.restore()

    // (4) POINTS
    ctx.translate(640, 0)
    ctx.save()
    ctx.clip(rect0.path())
    renderFill(ctx, rect0, FillType.POINTS, true, 0.2, 0.3, 3, 2)
    ctx.restore()

    ctx.save()
    ctx.clip(rect1.path())
    renderFill(ctx, rect1, FillType.POINTS, true, 0.5, 0.2, 3, 2)
    ctx.restore()

    ctx.save()
    ctx.clip(rect2.path())
    renderFill(ctx, rect2, FillType.POINTS, true, 0.8, 0.1, 3, 2)
    ctx.restore()

    // (5) DABS
    ctx.translate(640, 0)
    ctx.save()
    ctx.clip(rect0.path())
    renderFill(ctx, rect0, FillType.DABS, true, 0.2, 0.3, 8, 4.0)
    ctx.restore()

    ctx.save()
    ctx.clip(rect1.path())
    renderFill(ctx, rect1, FillType.DABS, true, 0.5, 0.2, 4, 4.0)
    ctx.restore()

    ctx.save()
    ctx.clip(rect2.path())
    renderFill(ctx, rect2, FillType.DABS, true, 0.8, 0.1, 2, 4.0)
    ctx.restore()

    // == OUTPUT to SHADER ===
    glClear([0, 0, 0, 1])
    useShader(shader)
    useTexture(gl.TEXTURE0, 'tex', ctx.canvas)
    drawScreen()

    /*
    let drawnRect = { x: 100, y: 400, w: 1200 - 200, h: 400 }

    // SECOND APPROACH: lines drawn from edge to edge of a circle clipped to shape
    function circleTexture(ctx, iter) {
        const r = 80
        ctx.lineWidth = 0.1
        for (let i = 0; i <= 2 * Math.PI * r * iter * 1.0; i++) {
            const rt1 = random(0, Math.PI * 2.0)
            const rt2 = random(0, Math.PI * 2.0)

            const cx1 = 50 + r * Math.cos(rt1)
            const cy1 = 50 + r * Math.sin(rt1)

            const cx2 = 50 + r * Math.cos(rt2)
            const cy2 = 50 + r * Math.sin(rt2)

            ctx.beginPath()
            ctx.moveTo(cx1, cy1)
            ctx.lineTo(cx2, cy2)
            ctx.stroke()
        }
    }

    // Second Approach: circles (stroke, no sroke)

    // First Approach: simulated brush strokes
    // Third Approach: pixel based noise sampling
    // generate small rectangles randomly distributed in a large rectangular area

    // const numberOfRectangles = 200000 // Number of rectangles to draw
    // const rectWidth = 30 // Fixed width of a rectangle
    // const rectHeight = 20 // Fixed height of a rectangle
    // const colorVariability = 20 // Variability in color (0 to 255)

    // TODO: layer a secondary noise to create a more interesting texture
    // possibly removing elements or skipping drawing elements based on the noise position

    // for (let i = 0; i < numberOfRectangles; i++) {
    //     ctx.save()
    //     const x = Math.random() * (width - rectWidth) // Ensure rectangles fit within the canvas
    //     const y = Math.random() * (height - rectHeight) // Ensure rectangles fit within the canvas
    //     const baseColor = 200 // Base color for RGB

    //     const color = `rgb(${3 + Math.floor(Math.random() * colorVariability)},
    //                       ${3 + Math.floor(Math.random() * colorVariability)},
    //                       ${300 + Math.floor(Math.random() * colorVariability)}, 0.08)`

    //     ctx.rotate(random(-0.1, 0.1))
    //     ctx.fillStyle = color
    //     ctx.fillRect(x, y, rectWidth + random(1, 3), rectHeight + random(1, 3))
    //     ctx.restore()
    // }

    // for (let i = 0; i < numberOfRectangles; i++) {
    //     ctx.save()
    //     const x = Math.random() * (width - rectWidth) // Ensure rectangles fit within the canvas
    //     const y = Math.random() * (height - rectHeight) // Ensure rectangles fit within the canvas
    //     const baseColor = 200 // Base color for RGB

    //     const color = `rgb(${176 + Math.floor(Math.random() * colorVariability)},
    //                       ${116 + Math.floor(Math.random() * colorVariability)},
    //                       ${12 + Math.floor(Math.random() * colorVariability)}, 0.008)`

    //     ctx.rotate(random(-0.1, 0.1))
    //     ctx.fillStyle = color
    //     ctx.fillRect(x, y, rectWidth + random(1, 3), rectHeight + random(1, 3))
    //     ctx.restore()
    // }
    */
}

draw()
