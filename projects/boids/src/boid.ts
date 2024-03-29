import { IVector, Vector } from './vector'

interface IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector

    simulate(
        flock: Boid[],
        bounds: IVector,
        perceptionRadius: number,
        maxSpeed: number,
        maxForce: number,
        gravity: number
    ): void
    draw(ctx: CanvasRenderingContext2D, size: number, color: string, debug: boolean): void
}

interface IBoidInfo {
    otherBoid: Boid
    distance: number
}

export default class Boid implements IBoid {
    position: IVector
    velocity: IVector
    acceleration: IVector

    constructor(position: IVector, velocity: IVector) {
        this.position = position
        this.velocity = velocity
        this.acceleration = Vector.zero()
    }

    calculateSeperation(boids: IBoidInfo[], maxSpeed: number, maxForce: number) {
        let steering = boids.reduce((acc, { otherBoid, distance }) => {
            let diff = this.position.subtract(otherBoid.position)
            diff = diff.divide(distance) // weight by distance
            return acc.add(diff)
        }, Vector.zero())
        let total = boids.length
        if (total > 0) {
            // average force value
            steering = steering.divide(total)

            // move towards goal as quickly as you can
            // Instead of directly setting to maxSpeed, scale the steering based on maxSpeed
            let magnitude = steering.magnitude()
            if (magnitude > 0) {
                steering = steering.normalize().scale(Math.min(maxSpeed, magnitude))
            }

            // move my velocity towards goal
            steering = steering.subtract(this.velocity)

            // apply maximum force limit - boids can only respond so quickly
            steering = steering.limit(maxForce)
        }
        return steering
    }

    calculateAlignment(boids: IBoidInfo[], maxForce: number) {
        // sum all the velocities of the other boids
        let avgVelocity = boids.reduce((acc, { otherBoid }) => {
            return acc.add(otherBoid.velocity)
        }, Vector.zero())
        let total = boids.length
        if (total > 0) {
            // average direction
            avgVelocity = avgVelocity.divide(total)

            // apply maximum force limit - boids can only respond so quickly
            avgVelocity = avgVelocity.limit(maxForce)

            // steer towards average
            avgVelocity = avgVelocity.subtract(this.velocity)
        }
        return avgVelocity
    }

    calculateCohesion(boids: IBoidInfo[], maxForce: number) {
        let centerOfMass = boids.reduce((acc, { otherBoid }) => {
            return acc.add(otherBoid.position)
        }, Vector.zero())
        let total = boids.length
        if (total > 0) {
            // average location
            centerOfMass = centerOfMass.divide(total)

            // steer towards center of mass
            centerOfMass = centerOfMass.subtract(this.position)

            // apply maximum force limit - boids can only respond so quickly
            centerOfMass = centerOfMass.limit(maxForce)

            return centerOfMass
        }
        return Vector.zero()
    }

    calculateGravity(center: Vector, gravity: number) {
        const towardsCenter = center.subtract(this.position).normalize()
        let scale = center.distance(this.position) / center.x // increase acceleration force when far away
        scale *= gravity // weak center of gravity
        return towardsCenter.scale(scale)
    }

    boidsInPerceptionRadius(flock: Boid[], perceptionRadius: number) {
        return flock
            .map((otherBoid) => {
                let distance = this.position.distance(otherBoid.position)
                return distance > 0 && distance < perceptionRadius ? { otherBoid, distance } : null
            })
            .filter((item) => item !== null) as IBoidInfo[]
    }

    simulate(
        flock: Boid[],
        bounds: IVector,
        perceptionRadius: number,
        maxSpeed: number,
        maxForce: number,
        gravity: number
    ) {
        // central gravity
        const center = new Vector(bounds.x / 2, bounds.y / 2)
        this.acceleration = this.calculateGravity(center, gravity) // clear and replace acceleration

        // this.acceleration = Vector.zero()

        // Get all boids within perception radius
        const inPerceptionRadius = this.boidsInPerceptionRadius(flock, perceptionRadius)

        this.acceleration = this.acceleration.add(
            this.calculateSeperation(inPerceptionRadius, maxSpeed, maxForce)
        )
        this.acceleration = this.acceleration.add(this.calculateAlignment(inPerceptionRadius, maxForce))
        this.acceleration = this.acceleration.add(this.calculateCohesion(inPerceptionRadius, maxForce))

        // physics update
        this.acceleration = this.acceleration.limit(maxForce)
        this.velocity = this.velocity.add(this.acceleration).limit(maxSpeed)
        this.position = this.position.add(this.velocity)
    }

    draw(ctx: CanvasRenderingContext2D, size: number, color: string, debug: boolean) {
        // Draw a triangle pointing in the direction of the velocity
        const angle = Math.atan2(this.velocity.y, this.velocity.x)

        // Define the points for the triangle
        const pointA = {
            x: this.position.x + Math.cos(angle) * size,
            y: this.position.y + Math.sin(angle) * size,
        }
        const pointB = {
            x: this.position.x + Math.cos(angle + (Math.PI * 2) / 3) * size,
            y: this.position.y + Math.sin(angle + (Math.PI * 2) / 3) * size,
        }
        const pointC = {
            x: this.position.x + Math.cos(angle - (Math.PI * 2) / 3) * size,
            y: this.position.y + Math.sin(angle - (Math.PI * 2) / 3) * size,
        }

        // Draw the triangle
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(pointA.x, pointA.y)
        ctx.lineTo(pointB.x, pointB.y)
        ctx.lineTo(pointC.x, pointC.y)
        ctx.closePath()
        ctx.fill()

        // Draw the debug line
        if (debug) {
            const debugLineLength = 20 // Adjust the length of the debug line as needed
            const debugLineEnd = {
                x: pointA.x + Math.cos(angle) * debugLineLength,
                y: pointA.y + Math.sin(angle) * debugLineLength,
            }

            ctx.strokeStyle = '#f00' // Red color for the debug line
            ctx.beginPath()
            ctx.moveTo(pointA.x, pointA.y)
            ctx.lineTo(debugLineEnd.x, debugLineEnd.y)
            ctx.stroke()
        }
    }
}
