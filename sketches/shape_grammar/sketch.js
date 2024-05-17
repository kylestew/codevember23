import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { line } from './tools/geo/shapes'
import { asPoints, edges, offset, splitAt } from './tools/geo/ops'
import { grid } from './tools/geo/extended'
import { zip, randomRemove } from './tools/array'
import { random, randomInt } from './tools/random'
import { draw } from './tools/draw'

// const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const palette = ['#0f261f', '#faed8f']
const [bg, primary, secondary] = palette

const ctx = createCanvas(1200, 1400)
ctx.background(bg)
setCanvasRange(ctx, -1.05, 1.05)

const inset = 0.05
const rowsCols = 5
const innerLines = 12
const lineWeight = 0.005
ctx.lineCap = 'round'

import { shapeGrammarFns } from './shapes'
// const shapeGrammerWeights = [1, 1]

const lines = grid([-1, -1.2], [2, 2.4], 6, 5)
    .rects()
    .map((rect, idx) => {
        draw(ctx, rect, { stroke: '#ffffff99', weight: 0.005 })

        // inset each rect to give padding between
        const inRect = offset(rect, -inset)

        // split rect into 4 edges -> lists of evenly spaced points
        const sides = edges(inRect).map((side) => asPoints(line(side), innerLines))
        draw(ctx, sides, { fill: '#ff0000', weight: 0.005 })

        // convert edges to shape grammer
        const shapePts = shapeGrammarFns[idx](sides)
        // const pts_lists = signalFlagFns[idx % signalFlagFns.length](ptsLists)
        // TODO: chose function based on weighted random
        // const pts_lists = signalFlagFns[weightedRandom(signalFlagWeights)](ptsLists)

        // zip points lists into pairs and make lines
        let lines = zip(shapePts[0], shapePts[1]).map((pt_pair) => line(pt_pair))

        // random removal of some lines
        // const removeCount = randomInt(0, lines.length / 2)
        // lines = randomRemove(lines, removeCount)
        //...

        draw(ctx, lines, { stroke: primary, weight: lineWeight })

        // TODO: next level drawing
        // // EXP: draw lines over lines
        // // or line in lines, split PCT and overlay another line

        // const flipOneOrTwo = Math.random() < 0.5
        // const overLines = lines.map((line, idx) => {
        //     const flip = Math.random() < 0.5
        //     let pct = idx / innerLines
        //     if (flip) {
        //         pct = 1.0 - pct
        //     }
        //     // return splitAt(line, pct)[Math.random() < 0.5 ? 0 : 1]
        //     return splitAt(line, pct)[1]
        // })

        // TODO: draw interleaved
        // draw(ctx, lines, { stroke: primary + '44', weight: lineWeight })
        // draw(ctx, overLines, { stroke: secondary + '22', weight: lineWeight })
        // draw(ctx, lines, { stroke: primary + '22', weight: lineWeight })
        // draw(ctx, overLines, { stroke: secondary + '22', weight: lineWeight })
    })
