import { createGLCanvas, loadShader, useShader, useTexture, glClear, drawScreen, setUniform } from './util/gl-util.js'
import { createOffscreenCanvas } from './util/canvas-util.js'
import { random, randomInt, mapRange, pickRandom } from './util/util.js'

import { selectColors } from './color.js'

const w = 1080
const h = 1500

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const p = createOffscreenCanvas(w, h)
const p2 = createOffscreenCanvas(w, h)

const { bgc, palette } = selectColors()

const maxSize = 40
const pGridCols = randomInt(3, maxSize)
const pGridRows = randomInt(3, maxSize)
const p2GridCols = randomInt(3, maxSize)
const p2GridRows = randomInt(3, maxSize)

// Pattern params
const pRot = random(-Math.PI / 2.0, Math.PI / 2.0)
const pScale = mapRange(Math.abs(pRot), 0, Math.PI / 2.0, 1.25, 2.25)
const p2Rot = random(-Math.PI / 2.0, Math.PI / 2.0)
const p2Scale = mapRange(Math.abs(p2Rot), 0, Math.PI / 2.0, 1.25, 2.25)

// Shader values
const noiseModA = random(2, 10)
const noiseModB = random(2, 10)
const noiseStart = random(0, 100)
const fieldOff = random(0.05, 0.1)

function pGrid() {
    const cellW = w / pGridCols
    const cellH = h / pGridRows
    for (let x = 0; x < pGridCols; x++) {
        for (let y = 0; y < pGridRows; y++) {
            p.fillStyle = pickRandom(palette)
            p.fillRect(x * cellW, y * cellH, cellW, cellH)
        }
    }
}
function p2Grid() {
    const cellW = w / p2GridCols
    const cellH = h / p2GridRows
    for (let x = 0; x < p2GridCols; x++) {
        for (let y = 0; y < p2GridRows; y++) {
            p2.fillStyle = `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`
            p2.fillRect(x * cellW, y * cellH, cellW, cellH)
        }
    }
}

function draw() {
    p.background(bgc)
    p2.background(bgc)

    // setup graphics objects
    p.translate(w / 2, h / 2)
    p.rotate(pRot)
    p.scale(pScale, pScale)
    p.translate(-w / 2, -h / 2)

    p2.translate(w / 2, h / 2)
    p2.rotate(p2Rot)
    p2.scale(p2Scale, p2Scale)
    p2.translate(-w / 2, -h / 2)

    // draw some things into graphics objects
    pGrid()
    p2Grid()

    glClear([0, 0, 0, 1])
    useShader(shader)

    // send textures to shader
    // useTexture(gl.TEXTURE0, 'p1', p.canvas)
    useTexture(gl.TEXTURE0, 'p2', p2.canvas)

    // send uniform values to shader
    setUniform('noiseModA', noiseModA)
    setUniform('noiseModB', noiseModB)
    setUniform('noiseStart', noiseStart)
    setUniform('fieldOff', fieldOff)

    drawScreen()
}
draw()
