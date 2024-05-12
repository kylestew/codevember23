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

export function createCanvas(width: number, height: number, clearColor: string): TexContextData {
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true })
    if (!offCtx) {
        throw new Error('Could not create OffscreenCanvasRenderingContext2D')
    }

    offCtx.fillStyle = clearColor
    offCtx.fillRect(0, 0, width, height)

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
