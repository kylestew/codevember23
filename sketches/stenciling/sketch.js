import { createCanvas, setCanvasRange } from 'canvas-utils'
import { parse as parseFont } from 'opentype.js'
import fontUrl from './assets/Roboto-Black.ttf?url'

async function loadFont(url) {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const font = parseFont(buffer)
    return font
}

const fg = '#fde3c8'
const bg = '#178e96'

async function main() {
    const font = await loadFont(fontUrl)

    const ctx = createCanvas(1200, 1200, 'sketchCanvas')
    ctx.background(bg)
    ctx.fillStyle = fg

    // Text to be drawn and its size
    const text = '42'
    const fontSize = 640

    // Calculate text width and height to center it
    let path = font.getPath(text, 0, 0, fontSize)
    const textMetrics = path.getBoundingBox()

    const textWidth = textMetrics.x2 - textMetrics.x1
    const textHeight = textMetrics.y2 - textMetrics.y1

    // Centering text by adjusting start position
    const x = (ctx.canvas.width - textWidth) / 2
    const y = (ctx.canvas.height - textHeight) / 2 + textHeight // Aligning baseline to center

    // Draw the text on the canvas
    path = font.getPath(text, x, y, fontSize)
    path.fill = fg
    path.draw(ctx)
}

main()
