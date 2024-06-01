import { Line, Circle, Polygon } from './tools/geo'
import { asPoints, withAttribs, asPath } from './tools/geo'
import { random, randomPoint, pickRandom } from './tools/random'
import { full, linspace, range, takeEvery, randomRemove } from './tools/array'
import { colorCombinations } from './tools/color/wada'
import { createCanvas } from './tools/canvas-utils'
import { draw } from './tools/draw'
import { animate } from './tools/canvas-utils'
import { Bezier } from 'bezier-js'

// select a random color palette from your favorites
const selectedCombos = [
    121, 124, 125, 126, 127, 128, 131, 132, 135, 137, 139, 140, 143, 144, 147, 149, 151, 155, 161, 162, 166, 167, 169,
    171, 175, 178, 180, 182, 183, 184, 185, 187, 189, 190, 192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 207,
    208, 209, 211, 214, 216, 217, 218, 219, 221, 223, 224, 225, 226, 227, 229, 230, 231, 232, 234, 235, 238, 240, 241,
    242, 243, 244, 249, 252, 253, 254, 255, 256, 258, 259, 260, 261, 262, 263, 264, 268, 271, 272, 273, 275, 276, 279,
    281, 284, 284, 285, 288, 290, 292, 294, 296, 300, 302, 303, 304, 309, 310, 317, 318, 319, 320, 321, 323, 324, 325,
    328, 329, 330, 332, 336, 339, 340, 341, 343,
]
const paletteIdx = pickRandom(selectedCombos)
const palette = colorCombinations()[paletteIdx - 1]
console.log('selected palette', paletteIdx, palette)
const [bg, primary, secondary] = palette

const ctx = createCanvas(1200, 1500)
ctx.setRange(-1, 1)
ctx.clear(bg)

const colors = ['#eee', '222', ...palette]

// (1) Create an angled line across the canvas
// random forward or reverse angle
const lineLength = 2.0
const theta = pickRandom([(2.0 * Math.PI) / 3 + random(0, Math.PI / 8.0), Math.PI / 3 - random(0, Math.PI / 8.0)])
const center = randomPoint([-0.1, 0.1])
const diagonal = Line.withCenter(center, theta, lineLength)

// (2) Lerp points across the line (set distance)
const divisions = 9
const distance = lineLength / (divisions - 1)
const divisionPoints = asPoints(diagonal, divisions)

function doHalf(which) {
    // (3) Randomly create circles at each division point in 4 passes
    // - Each pass has a radius that is 4x, 2x, 1x, 0.5x the distance between division points
    // - A dice is thrown to determine if a placement is made during each pass
    function circlesPass(points, every, offset, keepAtLeast, rad, gen) {
        return randomRemove(takeEvery(points.slice(offset), every), random(0.0, 1.0 - keepAtLeast)).map(
            (pt) => new Circle(pt, rad, { gen })
        )
    }
    let circles = [
        circlesPass(divisionPoints, 3, 1, 0.4, distance * 2, 0),
        circlesPass(divisionPoints, 3, 1, 0.1, distance * 1.8, 1),
        circlesPass(divisionPoints, 2, 1, 0.3, distance * 1.0, 2),
        circlesPass(divisionPoints, 2, 1, 0.1, distance * 0.8, 3),
        circlesPass(divisionPoints, 1, 1, 0.05, distance * 0.5, 4),
    ].flat()

    // (4) Assign colors to the circles
    // try to apply rules based on generation
    // circles = circles.map((c) => withAttribs(c, { fill: pickRandom(colors), stroke: '#f00', weight: 0.01 }))
    circles = circles.map((c) => withAttribs(c, { fill: pickRandom(colors) }))

    // (5) Mask off half the canvas with original diagonal line
    // make a triangle covering the half of the canvas (hackish)
    if (which) {
        const mask = new Polygon([
            ...asPoints(Line.withCenter(center, theta, 10)),
            [10 * Math.cos(-theta), 10 * Math.sin(-theta)],
        ])
        ctx.clip(asPath(mask))
    }

    // draw the half
    draw(ctx, circles)
}

// draw(ctx, new Circle([0, 0], 0.5, { fill: 'red' }))

doHalf(false)
doHalf(true)
