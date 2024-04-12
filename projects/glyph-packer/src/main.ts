import './style.css'

import { MySketch } from './sketch'
import { SketchParams } from './types'
import { createUI } from './gui'

import { alphaNumericCharacterSet } from './lib/glyph-sets'
import { loadFontSet } from './lib/font-set'

const fonts = await loadFontSet()
// const characterSet = 'Speak softly and carry a big stick'.split('')
// array containing 61-73 ascii characters
const characterSet = alphaNumericCharacterSet

const params: SketchParams = {
    fonts,
    characterSet,
    // shapeSet
    canvasSize: {
        width: 600,
        height: 400,
    },
    density: 0.0001,
}

const sketch = new MySketch(params, document.getElementById('app')!)
createUI(params, sketch)
sketch.start()

// keep canvas centered and scaled
// TODO: finish this
function adjustCanvasSize() {
    const canvas = document.querySelector('#app svg') as HTMLCanvasElement
    if (!canvas) return

    // // Calculate height as 80% of viewport height
    // const height = window.innerHeight * 0.8

    // // Calculate width based on the aspect ratio
    // const width = height * aspectRatio

    // // Set canvas width and height
    // canvas.style.height = `${height}px`
    // canvas.style.width = `${width}px`
}

/*
// javascript needed to keep canvas aspect ratio correct
function adjustAspectRatio() {
    const aspectRatio = params.canvasSize.width / params.canvasSize.height
    const viewportHeight = window.innerHeight
    const desiredHeight = viewportHeight * 0.8 // 80% of viewport height
    const calculatedWidth = desiredHeight * aspectRatio

    // Set both width and max-width to ensure it doesn't exceed the viewport's width
    output.style.width = `${calculatedWidth}px`
    output.style.maxWidth = `${calculatedWidth}px`
}
adjustAspectRatio()
window.addEventListener('resize', adjustAspectRatio)
*/

// Adjust canvas size on load and window resize
window.addEventListener('load', adjustCanvasSize)
window.addEventListener('resize', adjustCanvasSize)

// TODO: CMD+S to save output on sketch
