import {
    createOffscreenCanvas,
    createGLCanvas,
    setCanvasRange,
    glClear,
    loadShader,
    useShader,
    useTexture,
    drawScreen,
} from 'canvas-utils'
import { map, range2d } from '@thi.ng/transducers'
import { rect, line } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'

const w = 1200
const h = 1200

// main drawing canvas
import vertexShaderSource from './shader.vert?raw'
import fragmentShaderSource from './shader.frag?raw'
const gl = createGLCanvas(w, h)
const shader = loadShader(vertexShaderSource, fragmentShaderSource)

// offscreen textures
const texACtx = createOffscreenCanvas(w, h)
setCanvasRange(texACtx, 0, 1)
const texBCtx = createOffscreenCanvas(w, h)
setCanvasRange(texBCtx, 0, 1)

// offscreen mask
const maskCtx = createOffscreenCanvas(w, h)
setCanvasRange(maskCtx, 0, 1)

function fillGrid(texture) {
    const squareSize = 0.1
    let fillColorIdx = 0
    let colors = ['#10439F', '#C65BCF', '#10439F', '#874CCC']

    draw(texture, [
        'g',
        { __background: '#000' },
        ...map((pt) => {
            if (++fillColorIdx >= colors.length) fillColorIdx = 0
            return rect(pt, [squareSize, squareSize], { fill: colors[fillColorIdx] })
        }, range2d(0, 1, 0, 1, squareSize, squareSize)),
    ])
}

function fillLines(texture) {
    const squareSize = 0.09
    let fillColorIdx = 0
    let colors = ['#874CCC', '#10439F', '#F27BBD']

    // still rects, just longer
    texture.translate(0.5, 0.5)
    texture.rotate(Math.PI / 4.0, Math.PI / 4.0)
    texture.scale(1.5, 1.5) // scale to fill edges
    texture.translate(-0.5, -0.5)
    draw(texture, [
        'g',
        { __background: '#000' },
        ...map((pt) => {
            if (++fillColorIdx >= colors.length) fillColorIdx = 0
            return rect(pt, [squareSize, 1], { fill: colors[fillColorIdx] })
        }, range2d(0, 1, 0, 1, squareSize, 1)),
    ])
}

fillGrid(texACtx)
fillLines(texBCtx)

// mask contents define which texture is sampled
// red channel is texA, green channel is texB
maskCtx.background('#0000')
maskCtx.fillStyle = '#F00'
maskCtx.fillRect(0.1, 0.1, 0.4, 0.4)
maskCtx.fillStyle = '#0F0'
maskCtx.fillRect(0.5, 0.5, 0.4, 0.4)
maskCtx.fillStyle = '#880'
maskCtx.beginPath()
maskCtx.arc(0.7, 0.3, 0.18, 0, 2 * Math.PI)
maskCtx.fill()

// == OUTPUT to SHADER ===
glClear([0, 0, 0, 1])
useShader(shader)

useTexture(gl.TEXTURE0, 'mask', maskCtx.canvas)
useTexture(gl.TEXTURE1, 'textureA', texACtx.canvas)
useTexture(gl.TEXTURE2, 'textureB', texBCtx.canvas)

drawScreen()
