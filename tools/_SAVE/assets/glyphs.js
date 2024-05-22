import { circle, rect, polygon, pathBuilder } from '@thi.ng/geom'

/*
 * Shape set reminiscent of a child's block set
 * All shapes are in -1 to 1 space and fill the space
 */
const childsBlocks = [
    () => {
        // circle
        return new circle([0, 0], 1)
    },
    () => {
        // square
        return new rect([-1, -1], [2, 2])
    },
    () => {
        // half circle (small)
        return pathBuilder().moveTo([1, 1]).cubicTo([1, -0.5], [-1, -0.5], [-1, 1]).closePath().current()
    },
    () => {
        // quarter circle
        return pathBuilder()
            .moveTo([-1, -1]) // Start at the top left corner
            .cubicTo([-1, 1], [1, 1], [1, 1]) // Control points and end point to form a quarter circle
            .lineTo([1, -1])
            .closePath()
            .current()
    },
    () => {
        // triangle
        return polygon([
            [-1, -1],
            [1, -1],
            [-1, 1],
        ])
    },
]

/*
 * From London rental bathroom - April 2024
 * Shapes have variance as if made by hand but with masking tape and paint
 */
const aprilBathroom = {
    rectangle: () => {
        // small or large size
        const size = randomCoinToss() ? random(0.4, 0.5) : random(0.74, 0.84)
        const offsetX = random(-0.2, 0.2)
        const offsetY = random(-0.2, 0.2)

        // TODO: random rotation
        throw new Error('Not implemented')

        return Rectangle.fromCenterSize([offsetX, offsetY], [size, size])
    },
}

/*
const rand = (num) => random(num - 8, num + 8)
const randN = (num) => random(num - 8, num)
const randP = (num) => random(num, num + 8)

function triangle() {
    const poly = new Polygon([
        [randN(0), randN(0)],
        [random(90, 110), rand(50)],
        [randN(0), randP(100)],
    ])
    return poly.path()
}

function half() {
    const poly = new Polygon([
        [randN(0), randN(0)],
        [randP(100), randP(100)],
        [randN(0), randP(100)],
    ])
    return poly.path()
}

function forks() {
    const poly1 = new Polygon([
        [randN(0), randN(0)],
        [randN(0), 100],
        [randN(50), 0],

        // second tine
        [randP(50), 0],
        [randP(100), 100],
        [100, 0],
    ])
    return poly1.path()
}

function hoop() {
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
    return bz.path()
}

function circle() {
    const centerPT = [random(45, 55), random(45, 55)]
    let rad = 40
    if (Math.random() < 0.333) {
        rad = 24
    }
    const circ = new Circle(centerPT, rad)

    return circ.blobbyBeziers(2).path()
}

function moon() {
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
    return bz.path()
}
*/
