import { interleave, takeEvery, rotate, shuffle, full, splitArray } from './tools/array'
import { pickRandom, random, randomInt } from './tools/random'

/// Returns two paired edges that line up as slats
function horizOrVerts(edges, vertical) {
    if (vertical === undefined) {
        vertical = Math.random() < 0.5
    }
    return [vertical ? edges[0].reverse() : edges[1].reverse(), vertical ? edges[2] : edges[3]]
}
function diagonals(edges, flipped) {
    if (flipped === undefined) {
        flipped = Math.random() < 0.5
    }
    let [edge0, edge1, edge2, edge3] = edges
    if (flipped) {
        edge0 = edge0.slice().reverse()
        edge3 = edge3.slice().reverse()
        return [edge0.concat(edge2), edge1.concat(edge3)]
    } else {
        edge1 = edge1.slice().reverse()
        edge0 = edge0.slice().reverse()
        return [edge1.concat(edge3), edge2.concat(edge0)]
    }
}
function curveHalf(edges, which) {
    return [edges[which], edges[(which + 1) % edges.length]]
}
/// returns the middle half of the array
function middle(array) {
    const sectionLength = Math.floor(array.length / 3)
    const parts = splitArray(array, sectionLength)
    return parts[1]
}
/// returns the second half of the array
function half(array, firstHalf = true) {
    const sectionLength = Math.floor(array.length / 2)
    const parts = splitArray(array, sectionLength)
    if (firstHalf) {
        return parts[0]
    } else {
        return parts[1]
    }
}
/// returns the first quarter and last quarter of the array
function ends(array) {
    const sectionLength = Math.floor(array.length / 3)
    const parts = splitArray(array, sectionLength)
    return parts[0].concat(parts[parts.length - 1])
}

/*
 * == Shape Grammer Functions:
 * + Takes incoming list of 4 edges of evenly spaced points (all same length)
 * + Spits out 2 edges of the same length that define connecting lines
 */
function empty(_) {
    return [[], []]
}

function slats(edges) {
    return horizOrVerts(edges)
}
function slatsHalf(edges) {
    const [edge0, edge1] = horizOrVerts(edges)
    const whichHalf = Math.random() < 0.5
    return [half(edge0, whichHalf), half(edge1, whichHalf)]
}
function slatsMiddle(edges) {
    const [edge0, edge1] = horizOrVerts(edges)
    return [middle(edge0), middle(edge1)]
}
function slatsEnds(edges) {
    const [edge0, edge1] = horizOrVerts(edges)
    return [ends(edge0), ends(edge1)]
}

function vertHorizFull(edges) {
    const flip = Math.random() < 0.5
    let [edge0, edge1] = horizOrVerts(edges, flip)
    let [edge2, edge3] = horizOrVerts(edges, !flip)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function vertHorizHalf(edges) {
    edges = rotate(edges, randomInt(0, 4))
    const flip = Math.random() < 0.5
    let [edge0, edge1] = horizOrVerts(edges, flip)
    let [edge2, edge3] = horizOrVerts(edges, !flip)
    // keep middle half
    edge0 = half(edge0)
    edge1 = half(edge1)
    edge2 = half(edge2)
    edge3 = half(edge3)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function vertHorizMiddle(edges) {
    const flip = Math.random() < 0.5
    let [edge0, edge1] = horizOrVerts(edges, flip)
    let [edge2, edge3] = horizOrVerts(edges, !flip)
    // keep middle half
    edge0 = middle(edge0)
    edge1 = middle(edge1)
    edge2 = middle(edge2)
    edge3 = middle(edge3)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function vertHorizEnds(edges) {
    const flip = Math.random() < 0.5
    let [edge0, edge1] = horizOrVerts(edges, flip)
    let [edge2, edge3] = horizOrVerts(edges, !flip)
    // keep middle half
    edge0 = ends(edge0)
    edge1 = ends(edge1)
    edge2 = ends(edge2)
    edge3 = ends(edge3)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function flipHalf(array, reverse = false) {
    const half = Math.floor(array.length / 2)
    const parts = splitArray(array, half)
    if (reverse) {
        return parts[1].concat(parts[0].reverse())
    } else {
        return parts[0].concat(parts[1].reverse())
    }
}

function vertHorizTwisted(edges) {
    const flip = Math.random() < 0.5
    let [edge0, edge1] = horizOrVerts(edges, flip)
    let [edge2, edge3] = horizOrVerts(edges, !flip)

    return [
        half(flipHalf(edge0)).concat(half(flipHalf(edge2, true))), //
        half(flipHalf(edge1, true)).concat(half(flipHalf(edge3))),
    ]
}

function diagonalsFull(edges) {
    return diagonals(edges)
}
function diagonalsHalf(edges) {
    const [edge0, edge1] = diagonals(edges)
    return [half(edge0), half(edge1)]
}
function diagonalsMiddle(edges) {
    const [edge0, edge1] = diagonals(edges)
    return [middle(edge0), middle(edge1)]
}
function diagonalsEnds(edges) {
    const [edge0, edge1] = diagonals(edges)
    return [ends(edge0), ends(edge1)]
}

function hatchedDiagonal(edges) {
    const [listA, listB] = diagonals(edges, true)
    const [listC, listD] = diagonals(edges, false)
    return [listA.concat(listC), listB.concat(listD)]
}
function hatchedV(edges) {
    edges = rotate(edges, randomInt(0, 4))
    const [listA, listB] = diagonals(edges, true)
    const [listC, listD] = diagonals(edges, false)
    return [half(listA).concat(half(listC)), half(listB).concat(half(listD))]
}
function hatchedMiddles(edges) {
    const [listA, listB] = diagonals(edges, true)
    const [listC, listD] = diagonals(edges, false)
    return [middle(listA).concat(middle(listC)), middle(listB).concat(middle(listD))]
}
function hatchedEnds(edges) {
    const [listA, listB] = diagonals(edges, true)
    const [listC, listD] = diagonals(edges, false)
    return [ends(listA).concat(ends(listC)), ends(listB).concat(ends(listD))]
}
function hatchedCabin(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    let edge0 = edges[idx]
    let edge1 = edges[(idx + 1) % edges.length].reverse()
    let edge2 = edges[(idx + 2) % edges.length]
    let edge3 = edges[(idx + 3) % edges.length].reverse()

    // keep middle half
    edge0 = middle(edge0)
    edge1 = middle(edge1)
    edge2 = middle(edge2)
    edge3 = middle(edge3)
    return [edge0.concat(edge1).concat(edge2).concat(edge3), edge1.concat(edge2).concat(edge3).concat(edge0)]
}

function star(edges) {
    const [edge0, edge1, edge2, edge3] = edges
    return [edge0.concat(edge1), edge2.concat(edge3)]
}
function starLess(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [takeEvery(edge0.concat(edge1), 2), takeEvery(edge2.concat(edge3), 2)]
}
function starPlus(edges) {
    const flip = Math.random() < 0.5
    let edge0 = flip ? edges[0] : edges[1]
    let edge1 = flip ? edges[2] : edges[3]

    let edge2 = flip ? edges[1] : edges[2]
    let edge3 = flip ? edges[3] : edges[0]

    // keep middle half
    edge0 = middle(edge0)
    edge1 = middle(edge1)
    edge2 = middle(edge2)
    edge3 = middle(edge3)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}
function starX(edges) {
    const [edge0, edge1, edge2, edge3] = edges
    return [ends(edge0).concat(ends(edge1)), ends(edge2).concat(ends(edge3))]
}

function curve(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    return curveHalf(edges, idx)
}
function curve2(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const [edge0, edge1] = curveHalf(edges, idx)
    const [_, edge2] = curveHalf(edges, idx + 1)
    return [edge0.concat(edge1), edge1.concat(edge2)]
}
function curve3(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const [edge0, edge1] = curveHalf(edges, idx)
    const [_, edge2] = curveHalf(edges, idx + 1)
    const [__, edge3] = curveHalf(edges, idx + 2)
    return [edge0.concat(edge1).concat(edge2), edge1.concat(edge2).concat(edge3)]
}
function curveCircle(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const [edge0, edge1] = curveHalf(edges, idx)
    const [_, edge2] = curveHalf(edges, idx + 1)
    const [__, edge3] = curveHalf(edges, idx + 2)
    const [___, edge4] = curveHalf(edges, idx + 3)
    return [edge0.concat(edge1).concat(edge2).concat(edge3), edge1.concat(edge2).concat(edge3).concat(edge4)]
}
function curveEye(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const [edge0, edge1] = curveHalf(edges, idx)
    const [_, edge2] = curveHalf(edges, idx + 1)
    const [__, edge3] = curveHalf(edges, idx + 2)
    const [___, edge4] = curveHalf(edges, idx + 3)
    return [edge0.concat(edge2), edge1.concat(edge3)]
}

function rotated(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    const edge1 = flip ? edges[2] : edges[3]
    const quarter = Math.floor(edge0.length / 4)
    return [rotate(edge0, quarter), rotate(edge1, -quarter)]
}
function oppositeFlipped(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0] : edges[1]
    const edge1 = flip ? edges[2] : edges[3]
    return [edge0, edge1]
}
function shifted(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    const edge1 = flip ? edges[2] : edges[3]
    const size = Math.floor(edge0.length / 2)
    return [rotate(edge0, 3).slice(3), rotate(edge1, 0).slice(3)]
}

export const shapeGrammarFns = [
    // vert or horiz
    slats,
    slatsHalf,
    slatsMiddle,
    slatsEnds,
    shifted,

    // vert and horiz
    vertHorizFull,
    vertHorizHalf,
    vertHorizMiddle,
    vertHorizEnds,
    rotated,

    // diagonal (one way)
    diagonalsFull,
    diagonalsHalf,
    diagonalsMiddle,
    diagonalsEnds,
    vertHorizTwisted,

    // diagonals
    hatchedDiagonal,
    hatchedV,
    hatchedMiddles,
    hatchedEnds,
    hatchedCabin,

    // stars
    star,
    starLess,
    starPlus,
    starX,
    oppositeFlipped,

    // curves
    curveCircle,
    curve,
    curve2,
    curveEye,
    curve3,
]
