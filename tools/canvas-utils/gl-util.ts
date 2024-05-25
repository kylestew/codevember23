import { installSaveCanvasCommand } from './canvas-save'
import { createShader, createShaderProgram } from './shader-program'

/**
 * Creates a WebGL canvas with the specified width and height.
 *
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param canvasId - The ID of the canvas element (optional, default is 'mainCanvasGL').
 *
 * @returns The WebGL rendering context.
 * @throws Error if WebGL is not supported in the browser.
 */
export function createGLCanvas(width: number, height: number, canvasId: string = 'mainCanvas'): WebGLRenderingContext {
    // Create a new canvas element even if it exists (need a new context)
    const newCanvas = document.createElement('canvas')
    let existingCanvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (existingCanvas) {
        document.body.replaceChild(newCanvas, existingCanvas)
    } else {
        document.body.appendChild(newCanvas)
    }
    let canvas = newCanvas
    canvas.id = canvasId
    canvas.width = width
    canvas.height = height

    // preserve buffer to CMD+S saving
    const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2', { preserveDrawingBuffer: true })
    if (!gl) {
        throw new Error('WebGL not supported in this browser!')
    }

    installSaveCanvasCommand(canvas)

    let currentProgram: WebGLProgram

    gl._clear = gl.clear
    gl.clear = function (color: number[] = [0, 0, 0, 0]) {
        const [r, g, b, a] = color
        gl.clearColor(r, g, b, a) // Clear to black, fully opaque
        gl.clearDepth(1.0) // Clear everything
        gl._clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }

    /**
     * Loads and compiles a shader program using the provided vertex and fragment shader sources.
     *
     * @param vertexShaderSource The source code of the vertex shader.
     * @param fragmentShaderSource The source code of the fragment shader.
     *
     * @returns The compiled shader program, or null if compilation fails.
     * @throws Error if the WebGL context has not been created yet.
     */
    gl.loadShader = function (vertexShaderSource: string, fragmentShaderSource: string) {
        if (!gl) {
            throw new Error('WebGL context not created yet!')
        }

        const vertexShader: WebGLShader | null = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
        if (!vertexShader) {
            console.error('Failed to create vertex shader')
            return null
        }

        const fragmentShader: WebGLShader | null = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
        if (!fragmentShader) {
            console.error('Failed to create fragment shader')
            return null
        }

        const shaderProgram: WebGLProgram | null = createShaderProgram(gl, vertexShader, fragmentShader)
        return shaderProgram
    }

    gl.useShader = function (program: WebGLProgram) {
        gl.useProgram(program)
    }

    // Declaring variables for buffers
    let positionBuffer: WebGLBuffer | null = null
    let texCoordBuffer: WebGLBuffer | null = null

    // Function to draw on the screen
    /**
     * Draws the screen using WebGL.
     *
     * @throws {Error} If WebGL context or current program is not created yet.
     */
    gl.drawScreen = function (): void {
        // Initialize buffers if they haven't been created yet
        if (!positionBuffer) {
            positionBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            const positions = new Float32Array([
                -1,
                -1, // First triangle
                1,
                -1,
                -1,
                1,
                -1,
                1, // Second triangle
                1,
                -1,
                1,
                1,
            ])
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

            texCoordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            const textureCoords = new Float32Array([
                0.0,
                0.0, // Corresponds to -1, -1
                1.0,
                0.0, // Corresponds to  1, -1
                0.0,
                1.0, // Corresponds to -1,  1
                0.0,
                1.0, // Second triangle
                1.0,
                0.0,
                1.0,
                1.0,
            ])
            gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW)
        }

        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)

        // Setup for position attribute
        const positionAttributeLocation = gl.getAttribLocation(currentProgram, 'aPosition')
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

        // Setup for texture coordinate attribute
        const texCoordAttributeLocation = gl.getAttribLocation(currentProgram, 'aTexCoord')
        gl.enableVertexAttribArray(texCoordAttributeLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0)

        // Draw the triangles
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    /**
     * Binds a texture to a WebGL context and connects it to a shader uniform.
     *
     * @param textureId - The texture unit to bind the texture to.
     * @param uniformName - The name of the shader uniform to connect the texture to.
     * @param data - The texture data to bind. Can be an HTMLCanvasElement, OffscreenCanvas, or a WebGLTexture object.
     *
     * @throws Error if the WebGL context or current program is not available.
     */
    gl.useTexture = function (textureId: number, uniformName: string, data: TexImageSource) {
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)

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

    return gl
}

/*
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
*/
