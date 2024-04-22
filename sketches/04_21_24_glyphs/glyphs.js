import { random, randomInt, mapRange, pickRandom } from './util/util.js'

const rand = (num) => random(num - 8, num + 8)
const randN = (num) => random(num - 8, num)
const randP = (num) => random(num, num + 8)

function triangle(ctx) {
    ctx.beginPath()
    ctx.moveTo(randN(0), randN(0))
    ctx.lineTo(random(90, 110), rand(50))
    ctx.lineTo(randN(0), randP(100))
    ctx.closePath()
    ctx.fill()
}

function hoop(ctx) {
    ctx.beginPath()
    ctx.moveTo(randN(0), 0)
    ctx.bezierCurveTo(random(15, 25), random(80, 120), random(75, 85), randP(100), 100, 0)
    ctx.fill()
}

function rect(ctx) {
    ctx.beginPath()
    const size = rand(65)
    const offsetX = random(-2, 2)
    const offsetY = random(-2, 2)
    const x = (100.0 - size) / 2.0 + offsetX
    const y = (100.0 - size) / 2.0 + offsetY
    ctx.fillRect(x, y, size, size)
    ctx.fill()
}

function drawBlobbyCircleWithCurves(ctx, centerX, centerY, averageRadius, variation, points, startAngle = 0) {
    // Calculate the step for each slice of the circle based on the number of points
    let angleStep = (Math.PI * 2) / points

    // Start angle and initial point coordinates
    let startAngleOffset = startAngle
    let initialRadius = averageRadius + Math.random() * variation
    let startX = centerX + initialRadius * Math.cos(startAngleOffset)
    let startY = centerY + initialRadius * Math.sin(startAngleOffset)

    ctx.moveTo(startX, startY)

    // Draw each segment with a bezier curve
    for (let i = 1; i <= points; i++) {
        // Calculate angles
        let angle = i * angleStep + startAngle
        let prevAngle = (i - 1) * angleStep + startAngle

        // Get radius for the control point (midpoint)
        let midRadius = averageRadius + Math.random() * variation
        let midX = centerX + midRadius * Math.cos(prevAngle + angleStep / 2)
        let midY = centerY + midRadius * Math.sin(prevAngle + angleStep / 2)

        // Get radius for the endpoint
        let radius = averageRadius + Math.random() * variation
        let x = centerX + radius * Math.cos(angle)
        let y = centerY + radius * Math.sin(angle)

        // Bezier curve control points are midpoints for now
        ctx.quadraticCurveTo(midX, midY, x, y)
    }

    // Close the path to complete the circle
    ctx.closePath()
}

function circle(ctx) {
    ctx.beginPath()

    ctx.moveTo(50, 0)
    // drawBlobbyCircleWithCurves(ctx, 50, 50, 40, 5, 4) // center (150,150), average radius 50, radius variation 20, points 8

    ctx.lineTo(100, 0)

    // ctx.bezierCurveTo(ctx, 100, 0, 100, 0, 100, 50)
    ctx.lineTo(100, 50)
    ctx.closePath()

    ctx.fill()
}

function forks(ctx) {
    ctx.beginPath()

    ctx.moveTo(randN(0), randN(0))
    ctx.lineTo(randN(50), 0)
    ctx.lineTo(randN(0), 100)
    ctx.closePath()

    ctx.moveTo(randP(50), 0)
    ctx.lineTo(100, 0)
    ctx.lineTo(randP(100), 100)
    ctx.closePath()

    ctx.fill()
}

export const glyphs = {
    // triangle,
    // hoop,
    // rect,

    circle,
    // circle(small)
    // half circle
    // moon

    // forks,
}

/*

  <circle id="circle" class="cls-1" cx="500" cy="500" r="451.1"/>
  <circle id="small_circle" class="cls-1" cx="500" cy="500" r="300"/>
  <path id="half" class="cls-1" d="M0,0l1000,1000H0V0Z"/>
  <path id="moon" d="M0,500 C0,223.86 223.86,0 500,0 C776.14,0 1000,223.86 1000,500"/>

  */
