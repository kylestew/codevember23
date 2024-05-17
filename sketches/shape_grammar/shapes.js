import { interleave, takeEvery, rotate, shuffle, full } from './tools/array'
import { pickRandom } from './tools/random'

function middle(array) {
    const middleIndex = Math.floor(array.length / 2)
    const quarterCount = Math.floor((array.length - 1) / 4)
    return array.slice(middleIndex - quarterCount, middleIndex + quarterCount)
}

/*
 * == Shape Grammer Functions:
 * + Takes incoming list of 4 edges of evenly spaced points (all same length)
 * + Spits out 2 edges of the same length that define connecting lines
 */
function empty(edges) {
    return [[], []]
}

function slats(edges) {
    const flip = Math.random() < 0.5
    return [flip ? edges[0].reverse() : edges[1].reverse(), flip ? edges[2] : edges[3]]
}
function slatsHalf(edges) {
    const flip = Math.random() < 0.5
    const edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    const edge1 = flip ? edges[2] : edges[3]
    const size = Math.floor(edge0.length / 2)
    return [edge0.slice(size), edge1.slice(size)]
}
function slatsMiddle(edges) {
    const flip = Math.random() < 0.5
    let edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    let edge1 = flip ? edges[2] : edges[3]
    // keep middle half
    edge0 = middle(edge0)
    edge1 = middle(edge1)
    return [edge0, edge1]
}
function slatsSides(edges) {
    const flip = Math.random() < 0.5
    let edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    let edge1 = flip ? edges[2] : edges[3]
    // remove middle 3rd from each edge
    edge0.splice(Math.floor(edge0.length / 3), Math.floor(edge0.length / 3))
    edge1.splice(Math.floor(edge1.length / 3), Math.floor(edge1.length / 3))
    return [edge0, edge1]
}
function slatsPlus(edges) {
    const flip = Math.random() < 0.5
    let edge0 = flip ? edges[0].reverse() : edges[1].reverse()
    let edge1 = flip ? edges[2] : edges[3]

    let edge2 = flip ? edges[1] : edges[2]
    let edge3 = flip ? edges[3] : edges[4]

    // keep middle half
    edge0 = middle(edge0)
    edge1 = middle(edge1)
    return [edge0.concat(edge2), edge1.concat(edge3)]
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
    const count = Math.floor((edges[idx].length + 2) / 2)
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

function curve(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length]
    return [edge0, edge1]
}
function curve2(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length]
    const edge2 = edges[(idx + 2) % edges.length]
    return [edge0.concat(edge1), edge1.concat(edge2)]
}
function curve3(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length]
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length]
    return [edge0.concat(edge1).concat(edge2), edge1.concat(edge2).concat(edge3)]
}

function curveCircle(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length]
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length]
    const edge4 = edges[(idx + 4) % edges.length]
    return [edge0.concat(edge1).concat(edge2).concat(edge3), edge1.concat(edge2).concat(edge3).concat(edge4)]
}
function curveEye(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length]
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length]
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

function hatchedCenter(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [edge0.concat(edge1).concat(edge2).concat(edge3), edge1.concat(edge2).concat(edge3).concat(edge0)]
}

function hatchedStar(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [edge0.concat(edge1), edge2.concat(edge3)]
}
function hatchedStarLess(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [takeEvery(edge0.concat(edge1), 2), takeEvery(edge2.concat(edge3), 2)]
}

function starPlus(edges) {
    const idx = Math.floor(Math.random() * edges.length)
    const edge0 = edges[idx]
    const edge1 = edges[(idx + 1) % edges.length].reverse()
    const edge2 = edges[(idx + 2) % edges.length]
    const edge3 = edges[(idx + 3) % edges.length].reverse()
    return [edge0.concat(edge1), edge2.concat(edge3)]
}
// starX

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

export const shapeGrammarFns = [
    // vert, horiz
    slats,
    slatsHalf,
    slatsMiddle,
    slatsSides,
    // slatsPlus,
    empty,

    // diagonals
    diagonalsFull,
    diagonalsHalf,
    diagonalsMiddle,
    diagonalsSides,
    // diagonalsX
    empty,

    // hatches
    hatchedVertHoriz,
    hatchedDiagonal,
    hatchedV,
    // hatchedCenter,
    // hatchedOutsides,
    empty,
    empty,

    // curves
    curveEye,
    curve,
    curve2,
    curve3,
    curveCircle,

    // odds and ends
    oppositeFlipped,
    chords,
    rotated,
    collapsed,
    collapsed_corner,
    shifted,
    hatchedStar,
    hatchedStarLess,
    // star plus / star X

    empty,
]
