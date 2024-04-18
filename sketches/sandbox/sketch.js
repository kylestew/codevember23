import { setupShaderProgram, glClear, drawQuad } from './gl.js'

const w = 1080
const h = 1500
const marg = w * 0.05

let canvas = document.getElementById('mainCanvas')
canvas.width = w
canvas.height = h
let gl = canvas.getContext('webgl')
if (!gl) {
    console.error('WebGL not supported in this browser!')
}

let shaderProgram = await setupShaderProgram(gl, 'shader.vert', 'shader.frag')
let programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
        fragmentColor: gl.getUniformLocation(shaderProgram, 'uFragmentColor'),
    },
}

function draw() {
    glClear(gl)

    // Set the color to blue
    gl.useProgram(programInfo.program)
    gl.uniform4f(programInfo.uniformLocations.fragmentColor, 0.0, 0.0, 1.0, 1.0)

    drawQuad(gl, programInfo)
}

draw()
