export type SketchParams = {
    background: Color
    tint: Color
    subdivisions: number
}

export type SketchState = {
    status: 'running' | 'stopped'
    progress: number
}

export type Color = { r: number; g: number; b: number; a: number }

export interface ISketch {
    state: SketchState

    start(): void
    stop(): void
}

export abstract class Sketch implements ISketch {
    params: SketchParams
    state: SketchState = { status: 'stopped', progress: 0 }

    private frameDelay: number

    constructor(params: SketchParams, frameDelay: number = 1) {
        this.params = params
        this.frameDelay = frameDelay
    }

    abstract setup(): void
    abstract update(iteration: number): number
    abstract render(): void

    async start() {
        this.setup()

        this.state = { status: 'running', progress: 0 }

        let updateCount = 0
        while (this.state.status === 'running') {
            this.state.progress = this.update(updateCount++)
            this.render()

            // Pause for a short time (e.g., 100 milliseconds)
            // This allows the browser to update the UI
            await new Promise((resolve) => setTimeout(resolve, this.frameDelay))
        }
    }

    stop() {
        this.state = { status: 'stopped', progress: 0 }
    }
}
