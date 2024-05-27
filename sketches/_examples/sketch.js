import { createCanvas } from './tools/canvas-utils'
import { colorCombinations } from './tools/color/wada'
import { examples } from './examples'

// select a random color palette
const combos = colorCombinations()
let palette
do {
    palette = combos[Math.floor(Math.random() * combos.length)]
} while (palette.length < 3)

const [bg, primary, secondary] = palette
const RUN_ALL = true
const EXAMPLE = 7

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
