import { Rectangle, asPath, centroid } from '../tools/geo'
import { draw } from '../tools/draw'

export function rectDivide(ctx, palette) {
    const [bg, primary, secondary] = palette
}

/*
const w = 1200
const h = 1200

const gl = createGLCanvas(w, h)
const shader = await loadShader('shader.vert', 'shader.frag')

const ctx = createOffscreenCanvas(w, h)

// TODO: tune the splitting algorithm
function recursiveSplit(rect, horizontal, iteration = 0) {
    // Base condition: if maximum recursion depth is reached, return the current rectangle in an array
    if (iteration >= 6) {
        return [rect]
    }

    // randomly stop splitting
    if (iteration > 1 && Math.random() < 0.2) {
        return [rect]
    }

    const pct = randomInArray([0.25, 0.5, 0.5, 0.5, 0.75])
    // const pct = truncatedGaussian(0.5, 0.3, 0.2, 0.8) // Assuming truncatedGaussian is defined to ensure a valid split
    const [r0, r1] = rect.split(pct, horizontal) // Assuming a split method that splits the rect and returns two sub-rectangles

    // Recursively split each resulting rectangle, toggle the split direction, and collect all rectangles
    const rects0 = recursiveSplit(r0, !horizontal, iteration + 1)
    const rects1 = recursiveSplit(r1, !horizontal, iteration + 1)

    return rects0.concat(rects1)
}
function drawGlyph(row, col, rot, glyph) {
    ctx.save()

    // move to cell's top-left corner ctx.translate(col * cellSize, row * cellSize)
    // move to the center of the glyph's cell
    ctx.translate(cellSize / 2, cellSize / 2)
    // apply scaling
    ctx.scale(glyphScale, glyphScale)
    // apply rotation
    ctx.rotate(rot)
    // position in center of cell
    ctx.translate(-glyphSide / 2, -glyphSide / 2)

    // clip the shape to the cell
    ctx.beginPath()
    ctx.rect(0, 0, glyphSide, glyphSide)
    ctx.clip()

    // invoke draw
    glyph(ctx, row * 4 + col)
    ctx.clip()

    circleTexture(ctx, 9)

    ctx.restore()
}

function draw() {
    ctx.background('#222')
    ctx.fillStyle = '#eee'
    ctx.strokeStyle = '#eee'

    // create base rect and apply subdivision algo
    const baseRect = new Rectangle([20, 20], [w - 40, h - 40])
    ctx.stroke(asPath(baseRect))
    const rects = recursiveSplit(baseRect, true)

    // render glyphs in rects
    for (let rect of rects) {
        const glyph = randomInArray(Object.values(childsBlocks))()

        ctx.save()
        const rectCenter = centroid(rect)

        // determine scale based on area of rect vs glyph?
        // NOTE: glyphs are in [-1, 1] space
        const scale = Math.min(rect.size[0] / 2.0, rect.size[1] / 2.0)

        // TODO: random shape rotations

        // center scale
        ctx.scale(scale, scale)
        // put in position
        ctx.translate(rectCenter[0] / scale, rectCenter[1] / scale)

        console.log(glyph)
        ctx.fill(glyph)

        ctx.restore()

        ctx.stroke(asPath(rect))
    }

    // === FILL EXPLORATION ===
    // // render fullscreen texture sampling underlying colors
    // const fullRect = new Rect([0, 0], [w, h])
    // ctx.fillStyle = '#22222214'
    // ctx.strokeStyle = '#22222214'
    // renderFill(ctx, fullRect, FillType.FIBERS, true, 0.6, 1.0, 1.2, 0.6, (pt) => {
    //     const [x, y] = pt
    //     const pixel = colorSamplingCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
    //     const [r, g, b, a] = pixel
    //     return `rgba(${r}, ${g}, ${b}, ${a / 3000})`
    // })

    // == OUTPUT to SHADER ===
    glClear([0, 0, 0, 1])
    useShader(shader)
    useTexture(gl.TEXTURE0, 'tex', ctx.canvas)
    // useTexture(gl.TEXTURE0, 'tex', colorSamplingCtx.canvas)
    drawScreen()
}

draw()
*/
