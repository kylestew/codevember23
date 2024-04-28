import { Sketch, SketchParams } from './sketch'
import { Pane } from 'tweakpane'

const params: SketchParams = {
    canvasSize: [800, 600],

    background: '#222222',
    tint: '#ff88AA',

    subdivisions: 4,
}

const sketch = new Sketch(params)
sketch.reset()

const pane = new Pane()
pane.on('change', () => {
    sketch.reset()
})
const f1 = pane.addFolder({
    title: 'Basic',
    expanded: true,
})
f1.addBinding(params, 'background')
f1.addBinding(params, 'tint')
f1.addBinding(params, 'subdivisions', { label: 'Subdivisions', min: 0, max: 9, step: 1 })
