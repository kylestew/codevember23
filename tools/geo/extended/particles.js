export class Particle {
    constructor(pos, vel, accel, mass, lifetime) {
        this.pos = { ...pos } // Position vector
        this.vel = { ...vel } // Velocity vector
        this.accel = { ...accel } // Acceleration vector
        this.mass = mass // Mass of the particle
        this.lifetime = lifetime // Lifetime of the particle
        this.age = 0 // Age of the particle, initialized to 0
        this.history = [] // Array to store position history
    }

    update(deltaTime) {
        // Update velocity based on acceleration
        this.vel.x += this.accel.x * deltaTime
        this.vel.y += this.accel.y * deltaTime

        // Update position based on velocity
        this.pos.x += this.vel.x * deltaTime
        this.pos.y += this.vel.y * deltaTime

        // Record the current position in the history
        this.history.push({ x: this.pos.x, y: this.pos.y })

        // Update the age of the particle
        this.age += deltaTime
    }

    isAlive() {
        // Check if the particle's age is less than its lifetime
        return this.age < this.lifetime
    }
}
