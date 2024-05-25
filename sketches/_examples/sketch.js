import { createCanvas } from './tools/canvas-utils'
import { shuffle } from './tools/array'

import { examples } from './examples'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const RUN_ALL = true

if (!RUN_ALL) {
    const ctx = createCanvas(1200, 1200)
    ctx.setRange(-1.1, 1.1)
    ctx.clear(bg)

    const fn = examples[13]

    console.log('RUNNING EXAMPLE', fn.name)
    fn(ctx, palette)
} else {
    let canvasNum = 0
    const gridContainer = document.getElementById('grid-container')
    console.log('grudContainer', gridContainer)
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
