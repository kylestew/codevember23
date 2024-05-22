import { installSaveCanvasCommand } from './canvas-save'

/**
 * Creates a canvas element with the specified width and height, and returns its rendering context.
 * If a canvas ID is not provided, the default ID 'mainCanvas' is used.
 *
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param canvasId - The ID of the canvas element (optional).
 *
 * @returns The rendering context of the created canvas.
 * @throws {Error} If canvas is not supported in the browser.
 */
export function createCanvas(width: number, height: number, canvasId: string = 'mainCanvas'): CanvasRenderingContext2D {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) {
        // Create a new canvas element if it doesn't exist
        const newCanvas = document.createElement('canvas')
        newCanvas.id = canvasId
        document.body.appendChild(newCanvas)
        canvas = newCanvas
    }

    canvas.width = width
    canvas.height = height

    // const ctx = canvas.getContext('2d')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
        throw new Error('Canvas not supported in this browser!')
    }

    installSaveCanvasCommand(ctx.canvas)

    ctx.setRange = setCanvasRange.bind(ctx)
    ctx.clear = clear.bind(ctx)

    return ctx
}

/**
 * Creates an offscreen canvas with the specified width and height.
 *
 * @param width - The width of the offscreen canvas.
 * @param height - The height of the offscreen canvas.
 * @param clearColor - The color used to clear the offscreen canvas. Defaults to 'black'.
 *
 * @returns The OffscreenCanvasRenderingContext2D object representing the offscreen canvas.
 * @throws Error if the OffscreenCanvasRenderingContext2D cannot be created.
 */
export function createOffscreenCanvas(
    width: number,
    height: number,
    clearColor: string = 'white'
): OffscreenCanvasRenderingContext2D {
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true })

    if (!offCtx) {
        throw new Error('Could not create OffscreenCanvasRenderingContext2D')
    }

    offCtx.clearRect(0, 0, width, height)

    offCtx.setRange = setCanvasRange.bind(offCtx)
    offCtx.clear = clear.bind(offCtx)

    return offCtx
}

// Define the clear function
function clear(clearColor: string) {
    // Save the current transformation matrix
    this.save()

    // Reset the transformation matrix to the default state
    this.resetTransform()

    // Set the fill style to the clear color
    this.fillStyle = clearColor

    // Clear the canvas with the given color
    this.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Restore the previous transformation matrix
    this.restore()
}

/**
 * Sets the canvas range for a given CanvasRenderingContext2D.
 * This function scales and translates the canvas to fit the range [min, max] into the canvas dimensions.
 *
 * @param ctx - The CanvasRenderingContext2D to set the range for.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 */
export function setCanvasRange(
    min: number,
    max: number
): { min: [number, number]; max: [number, number]; clearCanvas: Function } {
    // Retrieve the canvas dimensions from the context
    const width = this.canvas.width
    const height = this.canvas.height

    // Determine the shortest side
    const size = Math.min(width, height)

    // Calculate the scale factor to fit [min, max] into the shortest side
    const scaleFactor = size / (max - min)

    // Reset transformations to default
    this.resetTransform()

    // Set up scaling
    this.scale(scaleFactor, scaleFactor)

    // Initialize translation values
    let translateX = 0
    let translateY = 0

    let excessWidth = 0
    let excessHeight = 0

    let xRange: [number, number] = [min, max]
    let yRange: [number, number] = [min, max]

    // Determine if width or height is the shortest dimension and calculate translation
    if (size === width) {
        // Width is the shortest, center vertically
        excessHeight = height - width
        translateY = excessHeight / (2 * scaleFactor)
        this.translate(-min, -min + translateY)

        // Update yRange to reflect the actual range being displayed
        const rescaleFactor = height / (max - min) / scaleFactor
        yRange = [min * rescaleFactor, max * rescaleFactor]
    } else {
        // Height is the shortest, center horizontally
        excessWidth = width - height
        translateX = excessWidth / (2 * scaleFactor)
        this.translate(-min + translateX, -min)

        // Update yRange to reflect the actual range being displayed
        const rescaleFactor = width / (max - min) / scaleFactor
        xRange = [min * rescaleFactor, max * rescaleFactor]
    }

    // Return new ranges describing how the canvas area is being used
    return {
        min: [xRange[0], yRange[0]],
        max: [xRange[1], yRange[1]],
        clearCanvas: clear,
    }
}
