import { Rect, rect, intersects } from '@thi.ng/geom'
import { IntersectionType } from '@thi.ng/geom-api'
import { ceil, floor, mulN } from '@thi.ng/vectors'

class CompareCanvas {
    // role out this entire compareCanvas thing into its own class
    private canvas: OffscreenCanvas
    private gl: WebGLRenderingContext

    private shaderProgram: WebGLProgram
    private positionBuffer: WebGLBuffer
    private programInfo: any
    private textureA: WebGLTexture
    private textureB: WebGLTexture

    private framebuffer: WebGLFramebuffer

    constructor(width: number, height: number) {
        this.canvas = new OffscreenCanvas(width, height)
        const gl = this.canvas.getContext('webgl')!
        this.gl = gl

        const vsSource = `
        attribute vec4 a_position;
        varying vec2 v_texCoord;

        void main() {
            gl_Position = a_position
            // Assuming a_position.xy ranges from -1 to 1, map to 0 to 1 for UV
            v_texCoord = a_position.xy * 0.5 + 0.5;
            // v_texCoord = a_position.xy;
        }
        `
        const fsSource = `
        precision mediump float;
        varying vec2 v_texCoord;

        uniform sampler2D u_texture_a;
        uniform sampler2D u_texture_b;
    
        void main() {
            vec4 sampleA = texture2D(u_texture_a, v_texCoord);
            vec4 sampleB = texture2D(u_texture_b, v_texCoord);

            if (sampleA.a > 0.0 && sampleB.a > 0.0) {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            } else {
                gl_FragColor = vec4(0.0);
            }
        }
        `
        this.shaderProgram = this.initShaderProgram(this.gl, vsSource, fsSource)!

        // Define the positions of the vertices of the rectangle
        const positions = new Float32Array([
            -1.0,
            1.0, // Top-left
            1.0,
            1.0, // Top-right
            -1.0,
            -1.0, // Bottom-left
            -1.0,
            -1.0, // Bottom-left
            1.0,
            1.0, // Top-right
            1.0,
            -1.0, // Bottom-right
        ])
        // Create a buffer for the vertex positions
        const positionBuffer = gl.createBuffer()!
        this.positionBuffer = positionBuffer
        // Bind the position buffer as the current array buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        // Pass the vertex data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
        this.programInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(this.shaderProgram, 'a_position'),
            },
            uniformLocations: {
                textureA: gl.getUniformLocation(this.shaderProgram, 'u_texture_a'),
                textureB: gl.getUniformLocation(this.shaderProgram, 'u_texture_b'),
            },
        }

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            2, // Number of components per vertex (x, y)
            gl.FLOAT, // The data type of each component
            false, // Normalization (not necessary here)
            0, // Stride (0 = use type and numComponents above)
            0 // Offset into the currently bound buffer
        )
        gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition)

        this.textureA = gl.createTexture()!
        gl.bindTexture(gl.TEXTURE_2D, this.textureA)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        this.textureB = gl.createTexture()!
        gl.bindTexture(gl.TEXTURE_2D, this.textureB)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        // // Create and bind the framebuffer
        // this.framebuffer = gl.createFramebuffer()!
        // gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)

        // // Create a texture to render to
        // const renderTexture = gl.createTexture()
        // gl.bindTexture(gl.TEXTURE_2D, renderTexture)
        // gl.texImage2D(
        //     gl.TEXTURE_2D,
        //     0,
        //     gl.RGBA,
        //     gl.canvas.width / 24.0,
        //     gl.canvas.height / 24.0,
        //     0,
        //     gl.RGBA,
        //     gl.UNSIGNED_BYTE,
        //     null
        // )

        // // Set up texture parameters
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // // Attach the texture as the framebuffer's color attachment
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0)
    }

    initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
        const vertexShader = this.compileShader(gl, vsSource, gl.VERTEX_SHADER)
        const fragmentShader = this.compileShader(gl, fsSource, gl.FRAGMENT_SHADER)

        // Create the shader program
        const shaderProgram = gl.createProgram()!
        gl.attachShader(shaderProgram, vertexShader)
        gl.attachShader(shaderProgram, fragmentShader)
        gl.linkProgram(shaderProgram)

        // Check if the program was created successfully
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
            return null
        }

        return shaderProgram
    }

    compileShader(gl, source, type) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        // Check if the shader compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
            gl.deleteShader(shader)
            return null
        }

        return shader
    }

    setImage(gl, texture, canvas) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
    }

    render(glyphCanvas: OffscreenCanvas, packedCanvas: OffscreenCanvas) {
        // Clear the canvas before we start drawing on it
        const gl = this.gl
        gl.clearColor(0.0, 0.0, 0.0, 0.0) // Clear to black, fully opaque
        gl.clearDepth(1.0) // Clear everything
        gl.enable(gl.DEPTH_TEST) // Enable depth testing
        gl.depthFunc(gl.LEQUAL) // Near things obscure far things

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height) // Set the viewport to cover the entire canvas
        // gl.viewport(0, 0, gl.canvas.width / 10.0, gl.canvas.height / 10.0) // Set the viewport to cover the entire canvas
        // gl.viewport(0, 0, 1, 1) // 1 px output

        // the secret sauce, adds all color to the framebuffer???
        // gl.enable(gl.BLEND)
        // gl.blendFunc(gl.ONE, gl.ONE)
        // Enable blending
        // gl.enable(gl.BLEND)
        // Set the blend function to additive blending
        // gl.blendFunc(gl.ONE, gl.ONE)

        gl.useProgram(this.shaderProgram)

        // Load textures
        this.setImage(gl, this.textureA, glyphCanvas)
        this.setImage(gl, this.textureB, packedCanvas)

        // Upload the glyph canvas and bind as texture A
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.textureA)
        gl.uniform1i(this.programInfo.uniformLocations.textureA, 0)

        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, this.textureB)
        gl.uniform1i(this.programInfo.uniformLocations.textureB, 1)

        // Draw the triangle
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
        gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition)

        // gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer) // tiny little guy
        gl.drawArrays(gl.TRIANGLES, 0, 6) // Draw the triangle

        const error = gl.getError()
        if (error !== gl.NO_ERROR) {
            console.error('WebGL error', error)
            // Handle the error appropriately
        }

        // // Create a buffer to store the read pixel
        // const pixelValue = new Uint8Array(4) // RGBA

        // // Read the pixel from the framebuffer
        // gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelValue)

        // // Log the pixel value or perform further processing
        // console.log('Pixel value:', pixelValue)

        // gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        return true
    }
}

export class ShapePacker {
    private domainBounds: Rect

    private scale: number
    private downscaleWidth: number
    private downscaleHeight: number

    private packedCanvas: OffscreenCanvas
    private packedCtx: OffscreenCanvasRenderingContext2D
    private glyphCanvas: OffscreenCanvas
    private glyphCtx: OffscreenCanvasRenderingContext2D

    private compareCanvas: CompareCanvas

    // TODO: you may no longer need to downscale
    constructor(width: number, height: number, downscale: number = 1) {
        this.domainBounds = rect([0, 0], [width, height])

        this.scale = 1.0 / downscale
        this.downscaleWidth = Math.floor(width / downscale)
        this.downscaleHeight = Math.floor(height / downscale)

        this.packedCanvas = new OffscreenCanvas(this.downscaleWidth, this.downscaleHeight)
        this.packedCtx = this.packedCanvas.getContext('2d')!
        // apply scale so drawing is correct
        this.packedCtx.scale(this.scale, this.scale)

        this.glyphCanvas = new OffscreenCanvas(this.downscaleWidth, this.downscaleHeight)
        this.glyphCtx = this.glyphCanvas.getContext('2d')!
        this.glyphCtx.scale(this.scale, this.scale)

        this.compareCanvas = new CompareCanvas(this.downscaleWidth, this.downscaleHeight)
    }

    canPlaceShape(bounds: Rect, renderCallback: (ctx: OffscreenCanvasRenderingContext2D) => void): boolean {
        // don't bother checking if the bounds are outside the domain
        // (in original domain size)
        if (intersects(this.domainBounds, bounds).type == IntersectionType.NONE) {
            return false
        }

        // Call the provided render callback to draw the glyph on glyphCtx
        this.glyphCtx.clearRect(0, 0, this.domainBounds.size[0], this.domainBounds.size[1])
        renderCallback(this.glyphCtx)

        this.compareCanvas.render(this.glyphCanvas, this.packedCanvas)

        /*
        // Prepare compareCtx by drawing packedCanvas, setting blend mode, then drawing glyphCanvas

        // TODO:bind packedCanvas and glyphCanvas as textures into shader
        // render to a 1x1 pixel, then read back the pixel value
        // if non-zero, then the glyph is overlapping

        // this.compareCtx.clearRect(0, 0, this.domainBounds.size[0], this.domainBounds.size[1]) // Ensure compareCtx is clear
        // this.compareCtx.globalCompositeOperation = 'source-over'
        // this.compareCtx.drawImage(this.packedCanvas, 0, 0)
        // this.compareCtx.globalCompositeOperation = 'source-in'
        // this.compareCtx.drawImage(this.glyphCanvas, 0, 0)

        // // Read back the pixels from comparCtx to check for non-zero pixels
        // // We only need to read withing the bounds of the newly rendered area
        // // grow those bounds a bit to ensure no issues with antialiasing
        // bounds.offset(2)
        // // // bounds = this.domainBounds
        // const pos = floor([], mulN([], bounds.pos, this.scale))
        // const size = ceil([], mulN([], bounds.size, this.scale))
        // const imageData: ImageData = this.compareCtx.getImageData(pos[0], pos[1], size[0], size[1])
        // // const imageData: ImageData = this.compareCtx.getImageData(0, 0, this.downscaleWidth, this.downscaleHeight)
        // const data: Uint8ClampedArray = imageData.data
        // // console.log(
        // //     this.compareCanvas.width,
        // //     this.compareCanvas.height,
        // //     this.downscaleWidth,
        // //     this.downscaleHeight,
        // //     data.length
        // // )
        // for (let i = 0; i < data.length; i += 4) {
        //     if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0 || data[i + 3] > 0) {
        //         return false
        //     }
        // }
        */
        return true
    }

    commitShape(renderCallback: (ctx: OffscreenCanvasRenderingContext2D) => void): void {
        renderCallback(this.packedCtx)
    }

    test() {
        const rectA = new Rect([50, 50], [100, 100])
        let result = this.canPlaceShape(rectA, (ctx: OffscreenCanvasRenderingContext2D) => {
            console.log('drawing rectA')
            ctx.fillRect(rectA.pos[0], rectA.pos[1], rectA.size[0], rectA.size[1])
        })
        if (result) {
            this.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
                console.log('committing rectA')
                ctx.fillRect(rectA.pos[0], rectA.pos[1], rectA.size[0], rectA.size[1])
            })
        }

        const rectB = new Rect([100, 100], [100, 100])
        result = this.canPlaceShape(rectB, (ctx: OffscreenCanvasRenderingContext2D) => {
            console.log('drawing rectB')
            ctx.fillRect(rectB.pos[0], rectB.pos[1], rectB.size[0], rectB.size[1])
        })
        // console.log(result, 'should be false')
        // if (result) {
        //     this.commitShape((ctx: OffscreenCanvasRenderingContext2D) => {
        //         console.log('committing rectB')
        //         ctx.fillRect(rectB.pos[0], rectB.pos[1], rectB.size[0], rectB.size[1])
        //     })
        // }
    }

    dumpToCanvas(canvas: HTMLCanvasElement, whichOne: string) {
        // size the canvas for display
        canvas.width = this.downscaleWidth
        canvas.height = this.downscaleHeight
        if (whichOne == 'glyph') {
            console.log('render glyph canvas')
            canvas.getContext('2d')!.drawImage(this.glyphCanvas, 0, 0)
        } else if (whichOne == 'packed') {
            canvas.getContext('2d')!.drawImage(this.packedCanvas, 0, 0)
        } else {
            canvas.getContext('2d')!.drawImage(this.compareCanvas.canvas, 0, 0)
        }
    }
}
