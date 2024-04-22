import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen, setUniform } from './util/gl-util.js'
import { createOffscreenCanvas } from './util/canvas-util.js'
import { random, randomInt, mapRange, pickRandom } from './util/util.js'

const w = 1200
const h = 1200

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const ctx = createOffscreenCanvas(w, h)

function draw(frame) {
    ctx.background('#eee')
    ctx.fillStyle = '#222'
    ctx.strokeStyle = '#2222'

    let drawnRect = { x: 100, y: 400, w: 1200 - 200, h: 400 }

    // FIRST APPROACH: lines across canvas area, small has lines
    // ctx.fillRect(drawnRect.x, drawnRect.y, drawnRect.w, drawnRect.h)
    // pick two random points in the rect
    // draw a line between them
    function randomInRect() {
        return {
            x: drawnRect.x + Math.random() * drawnRect.w,
            y: drawnRect.y + Math.random() * drawnRect.h,
        }
    }
    for (let i = 0; i < 100000; i++) {
        const pt0 = randomInRect()
        const pt1 = randomInRect()
        ctx.beginPath()
        ctx.moveTo(pt0.x, pt0.y)
        ctx.lineTo(pt1.x, pt1.y)
        ctx.stroke()
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

    glClear([0, 0, 0, 1])
    useShader(shader)
    useTexture(gl.TEXTURE0, 'tex', ctx.canvas)
    drawScreen()
}

draw(0)

// TODO: save canvas FN
