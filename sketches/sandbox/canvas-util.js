export function createOffscreenCanvas(width, height) {
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const offCtx = offscreenCanvas.getContext('2d')

    offCtx.fillStyle = 'black'
    offCtx.fillRect(0, 0, width, height)

    return offCtx
}
