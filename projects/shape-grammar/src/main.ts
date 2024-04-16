import './style.css'

import { MySketch } from './sketch'
import { SketchParams } from './types'
import { createUI } from './util/gui'

const params: SketchParams = {
    background: { r: 33, g: 66, b: 55, a: 1 },
    tint: { r: 192, g: 64, b: 64, a: 0.8 },
    subdivisions: 4,
    iterations: 15,
}

const sketch = new MySketch(params, document.getElementById('app')!)
createUI(params, sketch, (pane, wrapMidiBinding) => {
    // https://tweakpane.github.io/docs/input-bindings
    const f1 = pane.addFolder({
        title: 'Basic',
        expanded: true,
    })
    f1.addBinding(params, 'background')
    f1.addBinding(params, 'tint')

    wrapMidiBinding(f1, params, 'iterations', { label: 'Iterations', min: 0, max: 100, step: 1 })
    wrapMidiBinding(f1, params, 'subdivisions', { label: 'Subdivisions', min: 0, max: 9, step: 1.0 })
})
sketch.start()
