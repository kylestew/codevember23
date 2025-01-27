import './style.css'

import { MySketch } from './sketch'
import { SketchParams } from './types'
import { createUI } from './util/gui'

// TODO: replace with PNGs only
import { alphaNumericCharacterSet } from './lib/glyph-sets'
import { loadFontSet } from './lib/font-set'
import { svgToPaths } from './lib/svg_path_reader'

import SVG from './assets/glyphs.svg?raw'

const fonts = await loadFontSet()
const characterSet = 'Speak softly and carry a big stick'.split('')
// array containing 61-73 ascii characters
// const characterSet = alphaNumericCharacterSet
const shapeSet = svgToPaths(SVG)

const params: SketchParams = {
    fonts,
    characterSet,
    shapeSet,

    canvasSize: {
        width: 1920 / 2,
        height: 1080 / 2,
    },

    padding: 2,
}

const sketch = new MySketch(params, document.getElementById('app')!)
createUI(params, sketch, (pane, wrapMidiBinding) => {
    // https://tweakpane.github.io/docs/input-bindings
    const f1 = pane.addFolder({
        title: 'Basic',
        expanded: true,
    })
    f1.addBinding(params, 'padding', {
        label: 'Padding',
        min: 0.0,
        max: 10.0,
        step: 0.25,
    })

    // wrapMidiBinding(f1, params, 'iterations', { label: 'Iterations', min: 0, max: 100, step: 1 })
})
sketch.start()
