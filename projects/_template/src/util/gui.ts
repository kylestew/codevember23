import { Pane, FolderApi, BindingParams } from 'tweakpane'
import { SketchParams } from '../types'
import { WebMidi } from 'webmidi'

export function createUI(
    params: SketchParams,
    sketch: ISketch,
    constructorCallback: (
        pane: Pane,
        wrapMidiBinding: (
            folderOrPane: Pane | FolderApi,
            params: SketchParams,
            key: keyof SketchParams,
            info: BindingParams
        ) => void
    ) => void
) {
    let midiBindings: { key: keyof SketchParams; params: BindingParams }[] = []
    function wrapMidiBinding(
        folderOrPane: Pane | FolderApi,
        params: SketchParams,
        key: keyof SketchParams,
        info: BindingParams
    ) {
        // add it
        const binding = folderOrPane.addBinding(params, key, info)

        // register with midi controll info
        midiBindings.push({ key, params: info })
    }

    const pane = new Pane()

    constructorCallback(pane, wrapMidiBinding)

    const startFunc = setupExecutionFolder(pane, sketch)

    WebMidi.enable()
        .then(onEnabled)
        .catch((err) => alert(err))

    function onEnabled() {
        if (WebMidi.inputs.length === 0) {
            return
        }
        console.info('MIDI devices enabled')

        WebMidi.inputs[0].addListener('controlchange', (e) => {
            const channel = e.message.channel
            const number = e.controller.number
            const value = e.value

            if (channel > 1) {
                if (value == 1) {
                    startFunc()
                }
                return
            }

            if (number < 0 || number >= midiBindings.length) {
                return
            }
            const toChange = midiBindings[number]

            // map it!
            const min = toChange.params.min ?? 0.0
            const max = toChange.params.max ?? 1.0
            const step = toChange.params.step ?? 0.01
            let outValue = value * (max - min) + min
            outValue = Math.round(outValue / step) * step

            params[toChange.key] = outValue
            pane.refresh()
        })
    }
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

    return () => {
        sketch.start()
        updateReadout()
    }
}
