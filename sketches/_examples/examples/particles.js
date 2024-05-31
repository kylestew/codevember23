import { Particle } from '../tools/geo/extended/particles'
import { Polyline } from '../tools/geo'
import { asPoints } from '../tools/geo'
import { draw } from '../tools/draw'

function particleToLine(particle, timeSteps) {
    // Ensure the stepsBack is within the bounds of the history array
    const index = Math.max(0, particle.history.length - 1 - timeSteps)

    // Get the historical positions and the current position
    const pts = [...particle.history.slice(index), particle.pos]

    // Return a new Polyline from the points
    return new Polyline(pts)
}

export function particlesDemo(ctx, palette) {
    const [bg, primary, secondary] = palette

    // // Example usage:
    // const pos = { x: 0, y: 0 }
    // const vel = { x: 1, y: 1 }
    // const accel = { x: 0, y: -0.1 } // Simulating gravity
    // const mass = 1.0
    // const lifetime = 5.0 // Particle will live for 5 seconds

    // const particle = new Particle(pos, vel, accel, mass, lifetime)

    // // Simulate particle updates to fill history
    // const timeStep = 0.016 // 60 fps
    // for (let i = 0; i < 50; i++) {
    //     particle.update(timeStep)
    // }

    // const polyline = particleToLine(particle, 10)
    // draw(ctx, polyline, { stroke: primary, weight: 0.01 })
}
