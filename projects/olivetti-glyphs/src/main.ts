import './style.css'

import { createUI } from './gui'
import { App, AppParams } from './app'

const outputElm = document.getElementById('output')!

const params: AppParams = {
    canvasSize: {
        width: 1080,
        height: 1080,
    },
    density: 0.2,
}

let app: App | undefined
createUI(
    params,
    (progressCallback) => {
        app = new App(params, outputElm)
        app.start(progressCallback)
    },
    () => {
        app?.stop()
    }
)

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

// TODO: S to save SVG
