import { Pane } from 'tweakpane'

export function bindGUI(run, builderCallback) {
    const pane = new Pane()

    pane.on('change', (ev) => {
        run()
    })

    /* https://tweakpane.github.io/docs/input-bindings/ */
    builderCallback(pane)
}
