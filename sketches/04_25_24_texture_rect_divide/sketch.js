import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen } from './util/gl-util.js'
import { createOffscreenCanvas } from './util/canvas-util.js'
import { Rect } from './tools/geom.js'
import { FillType, renderFill } from './tools/fills.js'
import { randomInArray, truncatedGaussian } from './tools/random.js'

const w = 1200
const h = 1200

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const ctx = createOffscreenCanvas(w, h)

function draw() {
    ctx.background('#eee')

    function recursiveSplit(rect, horizontal, iteration = 0) {
        // Base condition: if maximum recursion depth is reached, return the current rectangle in an array
        if (iteration >= 6) {
            return [rect]
        }

        // randomly stop splitting
        if (iteration > 1 && Math.random() < 0.2) {
            return [rect]
        }

        const pct = randomInArray([0.25, 0.5, 0.5, 0.5, 0.75])
        // const pct = truncatedGaussian(0.5, 0.3, 0.2, 0.8) // Assuming truncatedGaussian is defined to ensure a valid split
        const [r0, r1] = rect.split(pct, horizontal) // Assuming a split method that splits the rect and returns two sub-rectangles

        // Recursively split each resulting rectangle, toggle the split direction, and collect all rectangles
        const rects0 = recursiveSplit(r0, !horizontal, iteration + 1)
        const rects1 = recursiveSplit(r1, !horizontal, iteration + 1)

        return rects0.concat(rects1)
    }

    const baseRect = new Rect([0, 0], [w, h]).inset(20)
    const rects = recursiveSplit(baseRect, true)
    // const rects = baseRect.split(0.5, true)

    for (let rect of rects) {
        ctx.stroke(rect.path())
    }

    // === FILL EXPLORATION ===
    // // render fullscreen texture sampling underlying colors
    // const fullRect = new Rect([0, 0], [w, h])
    // ctx.fillStyle = '#22222214'
    // ctx.strokeStyle = '#22222214'
    // renderFill(ctx, fullRect, FillType.FIBERS, true, 0.6, 1.0, 1.2, 0.6, (pt) => {
    //     const [x, y] = pt
    //     const pixel = colorSamplingCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
    //     const [r, g, b, a] = pixel
    //     return `rgba(${r}, ${g}, ${b}, ${a / 3000})`
    // })

    // == OUTPUT to SHADER ===
    glClear([0, 0, 0, 1])
    useShader(shader)
    useTexture(gl.TEXTURE0, 'tex', ctx.canvas)
    // useTexture(gl.TEXTURE0, 'tex', colorSamplingCtx.canvas)
    drawScreen()
}

draw()
