import { createCanvas } from './tools/canvas-utils'
import { colorCombinations } from './tools/color/wada'
import { pickRandom } from './tools/random'
import { examples } from './examples'
import { animate } from './tools/canvas-utils'

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
const RUN_ALL = true
const EXAMPLE = 20

if (!RUN_ALL) {
    const ctx = createCanvas(1200, 1200)
    ctx.setRange(-1.1, 1.1)
    ctx.clear(bg)

    const fn = examples[EXAMPLE]

    console.log('RUNNING EXAMPLE', fn.name)
    fn(ctx, palette)
} else {
    let canvasNum = 0
    const gridContainer = document.getElementById('grid-container')
    function runExample(fn) {
        const container = document.createElement('div')
        container.className = 'grid-item'
        const title = document.createElement('h3')
        container.appendChild(title)
        document.body.appendChild(container)
        const canvas = document.createElement('canvas')
        canvas.id = `canvas${canvasNum++}`
        container.appendChild(canvas)
        gridContainer.appendChild(container)

        const ctx = createCanvas(600, 600, canvas.id)
        ctx.setRange(-1.1, 1.1)
        ctx.clear(bg)

        title.textContent = fn.name
        fn(ctx, palette)
    }

    for (const example of examples) {
        runExample(example)
    }
}
