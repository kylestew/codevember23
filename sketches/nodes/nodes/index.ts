import { GeoContextData } from './geo'
import { TexContextData } from './tex/index'

type ContextData = GeoContextData | TexContextData

export function displayData(data: ContextData) {
    switch (data.kind) {
        case 'geo':
            throw new Error('Not implemented')
            break
        case 'tex':
            displayTexData(data.ctx.canvas)
            break
    }
}

function displayTexData(offscreenCanvas: OffscreenCanvas) {
    // Creating a new canvas element on the document body
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    canvas.id = 'outputCanvas'
    canvas.width = offscreenCanvas.width
    canvas.height = offscreenCanvas.height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('Canvas not supported in this browser!')
    }

    // Drawing the offscreen canvas onto the visible canvas
    ctx.drawImage(offscreenCanvas, 0, 0)
}
