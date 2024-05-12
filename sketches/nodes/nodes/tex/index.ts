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
