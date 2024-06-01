import { Line, circle } from '../tools/geo'
import { scatter } from '../tools/geo'
import { Grid } from '../tools/geo/extended'
import { easeInQuad } from '../tools/math/easings'
import { color as colorUtil } from '../tools/color'
import { mapRange } from '../tools/math'
import { draw } from '../tools/draw'

// weight: [0, 1]
// value: [0, 1]
function line01(line, weight, value, color = '#000000') {
    let lines = []

    // determine line count based on weight
    const lineCount = mapRange(easeInQuad(weight), 0, 1, 1, 40)

    // determine color based on value and color
    const alpha = easeInQuad(value)
    const newColor = colorUtil(color).alpha(alpha).toRgba()

    for (let i = 0; i < lineCount; i++) {
        // define circles at endpoints of line and pick random points in them to create a new line
        const rad = mapRange(weight, 0, 1, 0, 0.03)
        const pts = line.pts.map((p) => scatter(circle(p, rad), 1)[0])
        lines.push(new Line(pts, { stroke: newColor, weight: 0.005 }))
    }

    return lines
}

/* https://sighack.com/post/fifteen-ways-to-draw-a-line */
export function drawingLines(ctx, palette) {
    const [bg, primary, secondary] = palette

    // create a grid of slanted lines
    const positions = new Grid([-0.9, -0.9], [0.9 * 2, 0.9 * 2], 5, 10).centers()
    const baselines = positions.map((p) => Line.withCenter(p, Math.PI / 4.0, 0.4))

    // convert to line FN line using weights and values
    const lines = baselines.map((line, idx) => {
        const weight = mapRange((idx % 10) / 10, 0, 0.9, 0.1, 1.0)
        const value = mapRange(Math.floor(idx / 10), 0, 4, 0.1, 1.0)
        return line01(line, weight, value, primary)
    })

    draw(ctx, lines)
}
