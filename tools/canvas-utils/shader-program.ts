export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | null {
    const shader: WebGLShader | null = gl.createShader(type)
    if (!shader) {
        console.error('Failed to create shader')
        return null
    }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

export function createShaderProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
): WebGLProgram | null {
    const shaderProgram: WebGLProgram | null = gl.createProgram()
    if (!shaderProgram) {
        console.error('Failed to create shader program')
        return null
    }
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
        return null
    }
    return shaderProgram
}
