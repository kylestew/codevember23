import { Pane } from 'tweakpane'
import { ISketch, SketchParams } from './types'

export function createUI(params: SketchParams, sketch: ISketch) {
    const pane = new Pane()

    // https://tweakpane.github.io/docs/input-bindings
    const f1 = pane.addFolder({
        title: 'Basic',
        expanded: true,
    })
    f1.addBinding(params, 'density', {
        label: 'Density',
        min: 0.01,
        max: 1,
        step: 0.01,
    })
    // f1.addBinding(params, 'background')
    // f1.addBinding(params, 'tint')

    // f1.addBinding(params, 'subdivisions', {
    //     label: 'Subdivisions',
    //     min: 0,
    //     max: 12,
    //     step: 1,
    // })

    setupExecutionFolder(pane, sketch)
}

function setupExecutionFolder(pane: Pane, sketch: ISketch) {
    const f2 = pane.addFolder({
        title: 'Execution',
        expanded: true, // optional
    })
    const progressReadout = f2.addBlade({
        view: 'text',
        label: 'progress',
        parse: (v) => String(v),
        value: '0',
    })
    const stopButton = f2.addButton({
        title: 'Stop',
    })
    const startButton = f2.addButton({
        title: 'Start',
    })
    stopButton.on('click', () => {
        sketch.stop()
        updateReadout()
    })
    startButton.on('click', () => {
        sketch.start()
        updateReadout()
    })

    function updateReadout() {
        if (sketch.state.status === 'running') {
            progressReadout.hidden = false
            progressReadout.value = sketch.state.progress
            stopButton.disabled = false
            startButton.disabled = true
        } else {
            progressReadout.hidden = true
            stopButton.disabled = true
            startButton.disabled = false
        }
    }

    setInterval(() => {
        updateReadout()
    }, 500) // ms
    updateReadout()
}
