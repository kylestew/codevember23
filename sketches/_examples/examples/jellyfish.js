import { Circle, Line } from '../tools/geo/'
import { asPoints } from '../tools/geo/ops'
import { zip, rotate } from '../tools/array'
import { mapRange } from '../tools/math'
import { draw } from '../tools/draw'

function splitArrayInHalf(arr) {
    const middleIndex = Math.ceil(arr.length / 2)
    return [arr.slice(0, middleIndex), arr.slice(middleIndex)]
}

/* https://www.amygoodchild.com/blog/curved-line-jellyfish */
export function jellyfish(ctx, palette) {
    const [bg, primary, secondary] = palette

    let controlPt0 = [-1, 0]
    let controlPt1 = [1, 0]
    function render() {
        ctx.clear(bg)

        const circ = new Circle([0, 0], 1.0)
        const circPts = asPoints(circ, 128)
        const [a, b] = splitArrayInHalf(circPts)
        const pts = zip(a.reverse(), b)

        // DEBUG: draw as lines
        // const lines = pts.map(([a, b]) => new Line([a, b]))
        // draw(ctx, lines)

        ctx.strokeStyle = primary
        ctx.lineWidth = 0.005
        ctx.lineCap = 'round'

        pts.forEach(([a, b]) => {
            // const startPt = [-1, -1]
            // const destPt = [1, 1]
            // const startPt = [-0.5, -0.5]
            // const destPt = [0.5, 0.5]
            // const pts = [startPt, controlPt0, controlPt1, destPt]

            ctx.beginPath()
            ctx.moveTo(a[0], a[1])

            // ctx.lineTo(b[0], b[1])
            ctx.bezierCurveTo(controlPt0[0], controlPt0[1], controlPt1[0], controlPt1[1], b[0], b[1])

            ctx.stroke()
        })

        // TODO: randomly set control points in some sort of arangement
        // // ctx.quadraticCurveTo(controlPt[0], controlPt[1], destPt[0], destPt[1])
    }
    render()

    draw(ctx, [controlPt0, controlPt1])

    let isMouseDown = false
    let movingControlPt0 = false
    ctx.canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true
        movingControlPt0 = !movingControlPt0
    })

    ctx.canvas.addEventListener('mouseup', (event) => {
        isMouseDown = false
    })

    ctx.canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const canvas = event.target // Use 'event.target' instead of 'event.toElement'
            const rect = canvas.getBoundingClientRect() // Get the bounding rectangle of the canvas

            // Calculate mouse position within the canvas
            const mouseX = event.clientX - rect.left
            const mouseY = event.clientY - rect.top

            const width = rect.width
            const height = rect.height

            // Convert mouse position to canvas coordinates ranging from -1 to 1
            const canvasX = mapRange(mouseX / width, 0, 1, -1.1, 1.1)
            const canvasY = mapRange(mouseY / height, 0, 1, 1.1, -1.1)

            // Update control point with the converted coordinates
            if (movingControlPt0) {
                controlPt0 = [canvasX, canvasY]
            } else {
                controlPt1 = [canvasX, canvasY]
            }

            // Call the render function
            render()
        }
    })
}
