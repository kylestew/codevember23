import { random, randomInt, mapRange, pickRandom, rotateLeft, chunkArray } from './util/util.js'
import { randomInCircle, Line, Rect, Circle, Polygon, Beziers } from './geom.js'

const rand = (num) => random(num - 8, num + 8)
const randN = (num) => random(num - 8, num)
const randP = (num) => random(num, num + 8)

function triangle(ctx) {
    const poly = new Polygon([
        [randN(0), randN(0)],
        [random(90, 110), rand(50)],
        [randN(0), randP(100)],
    ])
    poly.outputPath(ctx)
}

function half(ctx) {
    const poly = new Polygon([
        [randN(0), randN(0)],
        [randP(100), randP(100)],
        [randN(0), randP(100)],
    ])
    poly.outputPath(ctx)
}

function forks(ctx) {
    const poly1 = new Polygon([
        [randN(0), randN(0)],
        [randN(0), 100],
        [randN(50), 0],

        // second tine
        [randP(50), 0],
        [randP(100), 100],
        [100, 0],
    ])
    poly1.outputPath(ctx)
}

function hoop(ctx) {
    const bz = new Beziers(
        // first point
        [randN(0), 0],
        // list of control pts
        [
            [
                [random(15, 25), random(80, 120)],
                [random(75, 85), randP(100)],
                [100, 0],
            ],
        ]
    )
    bz.outputPath(ctx)
}

function rect(ctx) {
    ctx.rotate(random(-0.02, 0.02))

    const size = rand(65)
    const offsetX = random(-2, 2)
    const offsetY = random(-2, 2)
    const x = (100.0 - size) / 2.0 + offsetX
    const y = (100.0 - size) / 2.0 + offsetY

    const rect = new Rect([x, y], [size, size])
    rect.outputPath(ctx)
}

function circle(ctx) {
    const centerPT = [random(45, 55), random(45, 55)]
    let rad = 40
    if (Math.random() < 0.333) {
        rad = 24
    }
    const circ = new Circle(centerPT, rad)

    circ.blobbyBeziers(2).outputPath(ctx)
}

function moon(ctx) {
    const bz = new Beziers(
        // first point
        [random(48, 52), 0],
        // list of control pts
        [
            [
                [random(72, 78), 0],
                [100, 25],
                [random(98, 104), rand(50)],
            ],
            [
                [100, random(74, 76)],
                [75, 100],
                [random(48, 52), 100],
            ],
        ]
    )
    bz.outputPath(ctx)
}

export const glyphs = {
    triangle,
    forks,
    rect,
    half,
    hoop,
    moon,
    circle,
}
