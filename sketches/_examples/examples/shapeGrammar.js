import { line } from '../tools/geo/shapes'
import { asPoints, edges, offset, splitAt, withAttribs } from '../tools/geo/ops'
import { grid } from '../tools/geo/extended'
import { zip, shuffle } from '../tools/array'
import { pickRandom } from '../tools/random'
import { shapeGrammarFns } from '../tools/assets/rect_grammar'
import { draw } from '../tools/draw'

export function shapeGrammar(ctx, palette) {
    const [bg, primary, secondary] = palette

    const rowsCols = 3
    const inset = 0.025
    const innerLines = 12 // number of lines in every grid cell - used to build shape
    const lineWeight = 0.01
    ctx.lineCap = 'round'

    const lines = grid([-1, -1], [2, 2], rowsCols, rowsCols)
        .rects()
        .map((rect, idx) => {
            // draw(ctx, rect, { stroke: '#ffffff99', weight: 0.005 })

            // inset each rect to give padding between
            const inRect = offset(rect, -inset)

            // split rect into 4 edges -> lists of evenly spaced points
            const sides = edges(inRect).map((side) => asPoints(line(side), innerLines))

            // convert edges to shape grammer
            // const shapePts = shapeGrammarFns[idx](sides)
            const shapePts = pickRandom(shapeGrammarFns)(sides)

            // zip points lists into pairs and make lines
            let lines = zip(shapePts[0], shapePts[1]).map((pt_pair) => line(pt_pair))
            // draw(ctx, lines, { stroke: '#ffffff22', weight: 0.01 })

            // ========================
            // random removal of some lines
            // const removeCount = randomInt(0, lines.length / 2)
            // lines = randomRemove(lines, removeCount)
            // ========================

            // ========================
            // overlay a second set of lines over the first
            const flipOneOrTwo = Math.random() < 0.5
            let overLines = lines.map((line, idx) => {
                const flip = Math.random() < 0.5
                let pct = idx / lines.length
                if (flip) {
                    pct = 1.0 - pct
                }
                //     // return splitAt(line, pct)[Math.random() < 0.5 ? 0 : 1]
                return splitAt(line, pct)[1]
            })
            // ========================

            // set color information
            lines = lines.map((line) => withAttribs(line, { stroke: primary, weight: lineWeight }))
            overLines = overLines.map((line) => withAttribs(line, { stroke: secondary, weight: lineWeight }))
            // const allLines = shuffle([...lines, ...overLines])

            draw(ctx, lines, { stroke: primary + '22', weight: lineWeight })
            // draw(ctx, overLines, { stroke: secondary + '22', weight: lineWeight })
        })
}
