import { Pane } from 'tweakpane'
import { AppParams } from './app'

export type ProgressCallback = (progress: number, completed: boolean) => void

export function createUI(params: AppParams, start: (progressCallback: ProgressCallback) => void, stop: () => void) {
    const pane = new Pane()

    pane.addBinding(params, 'density', {
        label: 'Density',
        min: 0.01,
        max: 1,
        step: 0.01,
    })

    const stopButton = pane.addButton({
        title: 'Stop',
    })
    const startButton = pane.addButton({
        title: 'Start',
    })

    function setRunningState(isRunning: boolean) {
        if (isRunning) {
            startButton.disabled = true
            stopButton.disabled = false
        } else {
            startButton.disabled = false
            stopButton.disabled = true
        }
    }
    setRunningState(false)

    function startRunning() {
        setRunningState(true)
        start((progress: number, completed: boolean) => {
            if (completed) {
                setRunningState(false)
            } else {
                console.log('progress', progress)
            }
        })
    }
    function stopRunning() {
        setRunningState(false)
        stop()
    }

    startButton.on('click', startRunning)
    stopButton.on('click', stopRunning)
}
