import { Rectangle } from '../tools/geo'
import { color } from '../tools/color'
import { full } from '../tools/array'
import { random } from '../tools/random'
import { floodFillAlgorithm } from '../tools/tex/flood-fill'
import { createOffscreenCanvas, setCanvasRange } from '../tools/canvas-utils'
import { draw } from '../tools/draw'

export function floodFill(ctx, palette) {
    const [bg, primary, secondary] = palette

    // create a bunch of randomly sized and positioned rectangles
    const rectCount = 18
    const rects = full(rectCount, () =>
        Rectangle.withCenter([random(-1.5, 1.5), random(-1.5, 1.5)], [random(0.4, 1.0), random(0.4, 1.1)])
    )

    // render the rects into offscreen context
    const offCtx = createOffscreenCanvas(ctx.canvas.width, ctx.canvas.height)
    setCanvasRange(offCtx, -1.1, 1.1)
    draw(offCtx, rects)

    // select a random position to start fill from
    const pt = [random(-0.8, 0.8), random(-0.8, 0.8)]

    // run flood fill algorithm
    // sections in the offscreen context will be filled with the primary color in the current onscreen context
    floodFillAlgorithm(offCtx, pt, color(primary).toArray(), ctx)
}
