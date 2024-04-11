import './style.css'

import { MySketch } from './sketch'
import { SketchParams } from './types'
import { createUI } from './gui'

const params: SketchParams = {
    background: { r: 33, g: 66, b: 55, a: 1 },
    tint: { r: 192, g: 64, b: 64, a: 0.8 },
    subdivisions: 6,
}

const sketch = new MySketch(params, document.getElementById('app')!)
createUI(params, sketch)
sketch.start()

// keep canvas centered and scaled
// TODO: finish this
function adjustCanvasSize() {
    const canvas = document.querySelector('#app canvas') as HTMLCanvasElement
    if (!canvas) return

    // // Calculate height as 80% of viewport height
    // const height = window.innerHeight * 0.8

    // // Calculate width based on the aspect ratio
    // const width = height * aspectRatio

    // // Set canvas width and height
    // canvas.style.height = `${height}px`
    // canvas.style.width = `${width}px`
}

// Adjust canvas size on load and window resize
window.addEventListener('load', adjustCanvasSize)
window.addEventListener('resize', adjustCanvasSize)

// TODO: CMD+S to save output on sketch
