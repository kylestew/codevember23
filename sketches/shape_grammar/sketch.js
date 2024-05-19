import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { line } from './tools/geo/shapes'
import { asPoints, edges, offset, splitAt, withAttribs } from './tools/geo/ops'
import { grid } from './tools/geo/extended'
import { zip, randomRemove, shuffle } from './tools/array'
import { random, randomInt, weightedRandom } from './tools/random'
import { draw } from './tools/draw'

// const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const palette = ['#0f261f', '#faed8f', '#ff616b']
const [bg, primary, secondary] = palette

const ctx = createCanvas(1200, 1200)
ctx.background(bg)
setCanvasRange(ctx, -1.05, 1.05)

const inset = 0.0025
const rowsCols = 9
// NOTE: some shapes act weird for certain inner line numbers
const innerLines = 13
const lineWeight = 0.009
ctx.lineCap = 'round'

import { shapeGrammarFns } from './shapes'
const shapeGrammerWeights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

const lines = grid([-1, -1], [2, 2], rowsCols, rowsCols)
    .rects()
    .map((rect, idx) => {
        // draw(ctx, rect, { stroke: '#ffffff99', weight: 0.005 })

        // inset each rect to give padding between
        const inRect = offset(rect, -inset)

        // split rect into 4 edges -> lists of evenly spaced points
        const sides = edges(inRect).map((side) => asPoints(line(side), innerLines))
        // draw(ctx, sides, { fill: '#ffffff22', weight: 0.005 })

        // convert edges to shape grammer
        // const shapePts = shapeGrammarFns[idx](sides)
        const shapePts = shapeGrammarFns[weightedRandom(shapeGrammerWeights)](sides)

        // zip points lists into pairs and make lines
        let lines = zip(shapePts[0], shapePts[1]).map((pt_pair) => line(pt_pair))

        // ========================
        // random removal of some lines
        const removeCount = randomInt(0, lines.length / 2)
        lines = randomRemove(lines, removeCount)
        // ========================

        // ========================
        // overlay a second set of lines over the first

        // const flipOneOrTwo = Math.random() < 0.5
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
        const allLines = shuffle([...lines, ...overLines])

        // TODO: draw interleaved
        draw(ctx, allLines)

        // draw(ctx, lines, { stroke: primary + '33', weight: lineWeight })
        // draw(ctx, overLines, { stroke: secondary + '33', weight: lineWeight })
        // draw(ctx, lines, { stroke: primary + '22', weight: lineWeight })
        // draw(ctx, overLines, { stroke: secondary + '22', weight: lineWeight })
    })
