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
    // ctx.beginPath()
    // ctx.rect(0, 0, glyphSide, glyphSide)
    // ctx.clip()

    // invoke draw
    glyph(ctx)

    ctx.restore()
}
const random90Deg = () => (randomInt(0, 4) * Math.PI) / 2

function draw(frame) {
    glClear([0, 0, 0, 1])
    useShader(shader)

    ctx.background('#222')
    ctx.fillStyle = '#eee'

    // build grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // draw only sometimes
            if (random() < 0.3) continue

            // TODO: disturb the shapes a bit

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

    //Create shader values
    // const noiseModA = random(2, 10)
    // const noiseModB = random(2, 10)
    // const noiseStart = random(0, 100)
    // const fieldOff = random(0.05, 0.1)

    // // send uniform values to shader
    // setUniform('noiseModA', noiseModA)
    // setUniform('noiseModB', noiseModB)
    // setUniform('noiseStart', noiseStart)
    // setUniform('fieldOff', fieldOff)

    drawScreen()
}

draw(0)
