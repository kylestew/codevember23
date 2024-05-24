import { createCanvas } from './tools/canvas-utils'
import { shuffle } from './tools/array'

import { examples } from './examples'

const palette = shuffle(['#ff616b', '#faed8f', '#0f261f'])
const [bg, primary, secondary] = palette

const RUN_ALL = false

if (!RUN_ALL) {
    const ctx = createCanvas(1200, 1200)
    ctx.setRange(-1.1, 1.1)
    ctx.clear(bg)

    const fn = examples[19]

    console.log('RUNNING EXAMPLE', fn.name)
    fn(ctx, palette)
} else {
    let canvasNum = 0
    function runExample(fn) {
        const container = document.createElement('div')
        const title = document.createElement('h3')
        container.appendChild(title)
        document.body.appendChild(container)
        const canvas = document.createElement('canvas')
        canvas.id = `canvas${canvasNum++}`
        container.appendChild(canvas)

        const ctx = createCanvas(600, 600, canvas.id)
        ctx.setRange(-1.04, 1.04)
        ctx.clear(bg)

        title.textContent = fn.name
        fn(ctx, palette)
    }

    for (const example of examples) {
        runExample(example)
    }
}
