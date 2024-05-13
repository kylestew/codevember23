import { GeoContextData } from '../geo'

/* === TEX CONTEXT ===
 * Notes:
 * - This is the pixel data domain
 * - The TEX context works with an OffscreenCanvasRenderingContext2D objects
 * - TEX streams do not make new data objects as they flow (GEO does)
 */

export type TexContextData = {
    kind: 'tex'
    readonly ctx: OffscreenCanvasRenderingContext2D
}

export function createCanvas(
    width: number,
    height: number,
    range: [number, number],
    clearColor: string
): TexContextData {
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true })
    if (!offCtx) {
        throw new Error('Could not create OffscreenCanvasRenderingContext2D')
    }

    offCtx.fillStyle = clearColor
    offCtx.fillRect(0, 0, width, height)

    setCanvasRange(offCtx, range[0], range[1])

    return { kind: 'tex', ctx: offCtx }
}

export function geoToTex(geo_data: GeoContextData, tex_data: TexContextData): TexContextData {
    const ctx = tex_data.ctx

    // for every geo instance, draw it
    for (const geo of geo_data.geo) {
        if (geo.pt_indices.length == 0) {
            console.error('degraded polygon, no points to draw')
            continue
        }
        if (geo.pt_indices.length < 2) {
            // draw a point?
            throw new Error('did you mean to draw a point?')
        }
        if (geo.closed) {
            throw new Error('filled polygons not supported')
        }

        // apply style attribs (or defaults)
        ctx.strokeStyle = geo.color ?? '#000000'

        // draw polyline
        let idx = geo.pt_indices[0]
        ctx.moveTo(geo_data.pts[idx].x, geo_data.pts[idx].y)
        console.log(geo_data.pts[idx].x, geo_data.pts[idx].y)
        for (let i = 1; i < geo.pt_indices.length; i++) {
            idx = geo.pt_indices[i]
            ctx.lineTo(geo_data.pts[idx].x, geo_data.pts[idx].y)
            console.log(geo_data.pts[idx].x, geo_data.pts[idx].y)
        }
        ctx.stroke()
    }

    return tex_data
}

function setCanvasRange(
    ctx: OffscreenCanvasRenderingContext2D,
    min: number,
    max: number
): { min: [number, number]; max: [number, number] } {
    // Retrieve the canvas dimensions from the context
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    // Determine the shortest side
    const size = Math.min(width, height)

    // Calculate the scale factor to fit [min, max] into the shortest side
    const scaleFactor = size / (max - min)

    // Reset transformations to default
    ctx.resetTransform()

    // Set up scaling
    ctx.scale(scaleFactor, scaleFactor)

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
        ctx.translate(-min, -min + translateY)

        // Update yRange to reflect the actual range being displayed
        const rescaleFactor = height / (max - min) / scaleFactor
        yRange = [min * rescaleFactor, max * rescaleFactor]
    } else {
        // Height is the shortest, center horizontally
        excessWidth = width - height
        translateX = excessWidth / (2 * scaleFactor)
        ctx.translate(-min + translateX, -min)

        // Update yRange to reflect the actual range being displayed
        const rescaleFactor = width / (max - min) / scaleFactor
        xRange = [min * rescaleFactor, max * rescaleFactor]
    }

    // Return new ranges describing how the canvas area is being used
    return {
        min: [xRange[0], yRange[0]],
        max: [xRange[1], yRange[1]],
    }
}
