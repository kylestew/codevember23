import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen, setUniform } from './util/gl-util.js'
import { createOffscreenCanvas } from './util/canvas-util.js'
import { random, randomInt, mapRange, pickRandom } from './util/util.js'
import { glyphs } from './glyphs.js'

const cellSize = 180
const rows = 6
const cols = 4
const w = cols * cellSize
const h = rows * cellSize

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const ctx = createOffscreenCanvas(w, h)

const glyphSide = 100
const glyphScale = cellSize / glyphSide
function drawGlyph(row, col, rot, glyph) {
    ctx.save()

    // move to cell's top-left corner
    ctx.translate(col * cellSize, row * cellSize)
    // move to the center of the glyph's cell
    ctx.translate(cellSize / 2, cellSize / 2)
    // apply scaling
    ctx.scale(glyphScale, glyphScale)
    // apply rotation
    ctx.rotate(rot)
    // position in center of cell
    ctx.translate(-glyphSide / 2, -glyphSide / 2)

    // clip the shape to the cell
    ctx.beginPath()
    ctx.rect(0, 0, glyphSide, glyphSide)
    ctx.clip()

    // invoke draw
    glyph(ctx, row * 4 + col)
    ctx.clip()

    circleTexture(ctx, 9)

    ctx.restore()
}
const random90Deg = () => (randomInt(0, 4) * Math.PI) / 2

// one way to make a texture
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

function draw(frame) {
    glClear([0, 0, 0, 1])
    useShader(shader)

    ctx.background('#222')
    ctx.fillStyle = '#eee'
    ctx.strokeStyle = '#eee'

    // build grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // draw only sometimes
            if (random() < 0.4) continue

            // drawGlyph(row, col, 0, pickRandom(Object.values(glyphs)))
            drawGlyph(row, col, random90Deg(), pickRandom(Object.values(glyphs)))
        }
    }

    // draw grid lines
    ctx.strokeStyle = '#444' // Color of the grid lines
    ctx.lineWidth = 4 // Width of the grid lines
    for (let row = 0; row <= rows; row++) {
        ctx.beginPath() // Begin a new path for the line
        ctx.moveTo(0, row * cellSize) // Start point of the line
        ctx.lineTo(w, row * cellSize) // End point of the line
        ctx.stroke() // Draw the line
    }
    for (let col = 0; col <= cols; col++) {
        ctx.beginPath() // Begin a new path for the line
        ctx.moveTo(col * cellSize, 0) // Start point of the line
        ctx.lineTo(col * cellSize, h) // End point of the line
        ctx.stroke() // Draw the line
    }

    useTexture(gl.TEXTURE0, 'tex', ctx.canvas)

    drawScreen()
}

draw(0)
