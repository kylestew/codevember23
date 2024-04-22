let gl
let currentProgram
import { installSaveCanvasCommand } from './canvas-util.js'

export function createGLCanvas(width, height) {
    let canvas = document.createElement('canvas')
    canvas.id = 'mainCanvas'
    document.body.appendChild(canvas)

    canvas.width = width
    canvas.height = height

    // preserve buffer to CMD+S saving
    gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    if (!gl) {
        console.error('WebGL not supported in this browser!')
    }

    installSaveCanvasCommand(gl.canvas)

    return gl
}

export function useShader(program) {
    currentProgram = program
    gl.useProgram(program)
}

export function glClear(color) {
    const [r, g, b, a] = color
    gl.clearColor(r, g, b, a) // Clear to black, fully opaque
    gl.clearDepth(1.0) // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

export function useTexture(textureId, uniformName, data) {
    gl.activeTexture(textureId)

    if (data instanceof HTMLCanvasElement || data instanceof OffscreenCanvas) {
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data)
    } else {
        gl.bindTexture(gl.TEXTURE_2D, data)
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // Connect the texture to the shader uniform
    const uniformLocation = gl.getUniformLocation(currentProgram, uniformName)
    // Since textureId typically is gl.TEXTURE0 + n, extract 'n' to set as the uniform
    const textureUnitIndex = textureId - gl.TEXTURE0
    gl.uniform1i(uniformLocation, textureUnitIndex)
}

export function setUniform(name, value) {
    const uniformLocation = gl.getUniformLocation(currentProgram, name)
    if (uniformLocation === null) {
        console.warn(`Uniform '${name}' not found.`)
        return
    }

    // Check the type of the value and use the appropriate uniform function
    if (typeof value === 'number') {
        gl.uniform1f(uniformLocation, value)
    } else if (Array.isArray(value)) {
        switch (value.length) {
            case 2:
                gl.uniform2fv(uniformLocation, value)
                break
            case 3:
                gl.uniform3fv(uniformLocation, value)
                break
            case 4:
                gl.uniform4fv(uniformLocation, value)
                break
            default:
                console.error(`Unsupported uniform array size: ${value.length}`)
        }
    } else if (value instanceof Float32Array && value.length === 16) {
        gl.uniformMatrix4fv(uniformLocation, false, value)
    } else {
        console.error(`Unsupported uniform type for '${name}'`)
    }
}

let positionBuffer = undefined
let texCoordBuffer = undefined
export function drawScreen() {
    if (positionBuffer === undefined) {
        // Create a buffer to put three 2d clip space points in
        positionBuffer = gl.createBuffer()

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

        // fill it with a 2 triangles that cover clip space
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1,
                -1, // first triangle
                1,
                -1,
                -1,
                1,
                -1,
                1, // second triangle
                1,
                -1,
                1,
                1,
            ]),
            gl.STATIC_DRAW
        )

        // Texture coordinate buffer setup
        texCoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0.0,
                0.0, // corresponding to -1, -1
                1.0,
                0.0, // corresponding to  1, -1
                0.0,
                1.0, // corresponding to -1,  1
                0.0,
                1.0, // second triangle
                1.0,
                0.0,
                1.0,
                1.0,
            ]),
            gl.STATIC_DRAW
        )
    }

    const positionAttributeLocation = gl.getAttribLocation(currentProgram, 'aPosition')
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2, // 2 components per iteration
        gl.FLOAT, // the data is 32bit floats
        false, // don't normalize the data
        0, // 0 = move forward size * sizeof(type) each iteration to get the next position
        0 // start at the beginning of the buffer
    )

    // Enable and bind the texture coordinate buffer
    const texCoordAttributeLocation = gl.getAttribLocation(currentProgram, 'aTexCoord')
    gl.enableVertexAttribArray(texCoordAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    gl.drawArrays(
        gl.TRIANGLES,
        0, // offset
        6 // num vertices to process
    )
}

export async function loadShader(vsSourcePath, fsSourcePath) {
    const vertexShaderSource = await loadShaderFile(vsSourcePath)
    const fragmentShaderSource = await loadShaderFile(fsSourcePath)

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader)
    return shaderProgram
}

async function loadShaderFile(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to load shader file: ${url}`)
    }
    return await response.text()
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

function createShaderProgram(gl, vertexShader, fragmentShader) {
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
        return null
    }
    return shaderProgram
}
