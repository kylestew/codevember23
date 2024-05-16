import { createCanvas, setCanvasRange } from './tools/canvas-utils'
import { line } from './tools/geo/shapes'
import { asPoints, edges, offset, splitAt } from './tools/geo/ops'
import { grid } from './tools/geo/extended'
import { zip, shuffle, full, rotate } from './tools/array'
import { pickRandom, weightedRandom, random, randomInt } from './tools/random'
import { draw } from './tools/draw'

function middleHalf(array) {
    const length = array.length
    const start = Math.floor(length / 4)
    const end = Math.ceil((3 * length) / 4)
    return array.slice(start, end)
}

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

const signalFlagWeights = [1, 1]
const signalFlagFns = [
    empty,
    opposite,
    oppositeHalf,
    oppositeMiddle,
    oppositeSides,
    curve,
    curve2,
    curve3,
    curveCircle,
    curveEye,
    curveSexy,
    diagonalsHalf,
    diagonalsFull,
    diagonalsMiddle,
    diagonalsSides,
    hatchedDiagonal,
    hatchedVertHoriz,
    hatchedV,
    hatchedStar,
    oppositeFlipped,
    chords,
    collapsed,
    collapsed_corner,
    shifted,
    rotated,
]

function empty(edges) {
    return [[], []]
}
function opposite(edges) {
    const flip = Math.random() < 0.5
    return [flip ? edges[0].reverse() : edges[1].reverse(), flip ? edges[2] : edges[3]]
}
function oppositeHalf(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    const edge1 = flip ? edges[2] : edges[3]
    const size = Math.floor(edge0.length / 2)
    return [edge0.slice(size), edge1.slice(size)]
}
function oppositeMiddle(edges) {
    const flip = Math.random() < 0.5
    let edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    let edge1 = flip ? edges[2] : edges[3]
    // keep middle half
    edge0 = edge0.slice(Math.floor(edge0.length / 4), Math.floor((edge0.length / 4) * 3))
    edge1 = edge1.slice(Math.floor(edge1.length / 4), Math.floor((edge1.length / 4) * 3))
    return [edge0, edge1]
}
function oppositeSides(edges) {
    const flip = Math.random() < 0.5
    let edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    let edge1 = flip ? edges[2] : edges[3]
    // remove middle 3rd from each edge
    edge0.splice(Math.floor(edge0.length / 3), Math.floor(edge0.length / 3))
    edge1.splice(Math.floor(edge1.length / 3), Math.floor(edge1.length / 3))
    return [edge0, edge1]
}
function curve(edges) {
    const randomIndex = Math.floor(Math.random() * edges.length)
    const nextIndex = (randomIndex + 1) % edges.length
    return [edges[randomIndex], edges[nextIndex]]
}
function curve2(edges) {
    const edge0 = Math.floor(Math.random() * edges.length)
    const edge1 = (edge0 + 1) % edges.length
    const edge2 = (edge0 + 2) % edges.length
    return [edges[edge0].concat(edges[edge1]), edges[edge1].concat(edges[edge2])]
}
function curve3(edges) {
    const edge0 = Math.floor(Math.random() * edges.length)
    const edge1 = (edge0 + 1) % edges.length
    const edge2 = (edge0 + 2) % edges.length
    const edge3 = (edge0 + 3) % edges.length
    return [
        edges[edge0].concat(edges[edge1]).concat(edges[edge2]),
        edges[edge1].concat(edges[edge2]).concat(edges[edge3]),
    ]
}
function curveCircle(edges) {
    const edge0 = Math.floor(Math.random() * edges.length)
    const edge1 = (edge0 + 1) % edges.length
    const edge2 = (edge0 + 2) % edges.length
    const edge3 = (edge0 + 3) % edges.length
    const edge4 = (edge0 + 4) % edges.length
    return [
        edges[edge0].concat(edges[edge1]).concat(edges[edge2]).concat(edges[edge3]),
        edges[edge1].concat(edges[edge2]).concat(edges[edge3]).concat(edges[edge4]),
    ]
}
function curveEye(edges) {
    const edge0 = Math.floor(Math.random() * edges.length)
    const edge1 = (edge0 + 1) % edges.length
    const edge2 = (edge0 + 2) % edges.length
    const edge3 = (edge0 + 3) % edges.length
    return [edges[edge0].concat(edges[edge2]), edges[edge1].concat(edges[edge3])]
}
function curveSexy(edges) {
    // TODO: what if I actually spliced together some of the edges?
    // const idx = Math.floor(Math.random() * edges.length)
    // const edge0 = edges[idx].slice(3)
    // const edge1 = edges[(idx + 1) % edges.length].slice(3)
    // const edge2 = edges[(idx + 2) % edges.length].slice(3)
    // const edge3 = edges[(idx + 3) % edges.length].slice(3)
    // return [edge0.concat(edge2), edge1.concat(edge3)]
    return [[], []]
}
function diagonalsHalf(edges) {
    const randomIndex = Math.floor(Math.random() * edges.length)
    const nextIndex = (randomIndex + 1) % edges.length
    return [edges[randomIndex].reverse(), edges[nextIndex]]
}
function diagonalsFull(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    let edge0 = edges[idx]
    let edge1 = edges[(idx + 1) % edges.length].reverse()
    let edge2 = edges[(idx + 2) % edges.length]
    let edge3 = edges[(idx + 3) % edges.length].reverse()
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function diagonalsMiddle(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const count = Math.floor(edges[idx].length / 2)
    let edge0 = edges[idx].reverse().slice(count)
    let edge1 = edges[(idx + 1) % edges.length].slice(count)
    let edge2 = edges[(idx + 2) % edges.length].reverse().slice(count)
    let edge3 = edges[(idx + 3) % edges.length].slice(count)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function diagonalsSides(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const count = Math.floor(edges[idx].length / 2) - 1
    let edge0 = edges[idx].slice(count)
    let edge1 = edges[(idx + 1) % edges.length].reverse().slice(count)
    let edge2 = edges[(idx + 2) % edges.length].slice(count)
    let edge3 = edges[(idx + 3) % edges.length].reverse().slice(count)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function hatchedDiagonal(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [edge0.concat(edge1).concat(edge2).concat(edge3), edge1.concat(edge2).concat(edge3).concat(edge0)]
}
function hatchedVertHoriz(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length]
    const edge2 = edges[(idx + 2) % edges.length].reverse()
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [edge0.concat(edge1), edge2.concat(edge3)]
}
function hatchedV(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    return [edge0.concat(edge1), edge1.concat(edge2)]
}
function hatchedStar(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [edge0.concat(edge1), edge2.concat(edge3)]
}
function oppositeFlipped(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0] : edges[1]
    const edge1 = flip ? edges[2] : edges[3]
    return [edge0, edge1]
}
function chords(edges) {
    const flip = Math.random() < 0.5
    let edge0 = flip ? edges[0] : edges[1]
    let edge1 = flip ? edges[2] : edges[3]
    edge0 = rotate(edge0, 3)
    edge1 = rotate(edge1, -3)
    return [edge0, edge1]
}
function collapsed(edges) {
    const flip = Math.random() < 0.5
    let sides = shuffle([flip ? edges[0].reverse() : edges[1].reverse(), flip ? edges[2] : edges[3]])
    sides[0] = full(sides[0].length, pickRandom(sides[0]))
    return sides
}
function collapsed_corner(edges) {
    const flip = Math.random() < 0.5
    let sides = shuffle([flip ? edges[0].reverse() : edges[1].reverse(), flip ? edges[2] : edges[3]])
    sides[0] = full(sides[0].length, sides[0][0]) // always the first point
    return sides
}
function shifted(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    const edge1 = flip ? edges[2] : edges[3]
    const size = Math.floor(edge0.length / 2)
    return [rotate(edge0, 3).slice(3), rotate(edge1, 0).slice(3)]
}
function rotated(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    const edge1 = flip ? edges[2] : edges[3]
    const quarter = Math.floor(edge0.length / 4)
    return [rotate(edge0, quarter), rotate(edge1, -quarter)]
}

// create a grid of flag positions
const lines = grid([-1, -1.2], [2, 2.4], 6, 5)
    .rects()
    .map((rect, idx) => {
        if (idx >= 26) return

        draw(ctx, rect)
        // inset each rect to give padding between
        const inRect = offset(rect, -inset)
        // draw(ctx, asPoints(inRect))
        // split into edges
        const sides = edges(inRect)
        // convert edges into point lists (line -> asPoints)
        const ptsLists = sides.map((side) => asPoints(line(side), innerLines))
        // manipulate the points lists into signal flags

        const pts_lists = signalFlagFns[idx % signalFlagFns.length](ptsLists)

        // draw(ctx, pts_lists)
        // console.log(pts_lists, 'zip'), zip(pts_lists[0], pts_lists[1]))

        // TODO: chose function based on weighted random
        // const pts_lists = signalFlagFns[weightedRandom(signalFlagWeights)](ptsLists)

        // zip points lists into pairs and make lines
        const lines = zip(pts_lists[0], pts_lists[1]).map((pt_pair) => line(pt_pair))
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
