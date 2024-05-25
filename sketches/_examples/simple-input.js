export function simpleMouseInput(htmlElement, didChangeCallback) {
    let isMouseDown = false
    let lastMousePt = [0, 0]

    htmlElement.addEventListener('mousedown', (event) => {
        isMouseDown = true
    })

    htmlElement.addEventListener('mouseup', (event) => {
        isMouseDown = false
        didChangeCallback(lastMousePt, false)
    })

    htmlElement.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const canvas = event.target // Use 'event.target' instead of 'event.toElement'
            const rect = canvas.getBoundingClientRect() // Get the bounding rectangle of the canvas

            // Calculate mouse position within the canvas
            const mouseX = event.clientX - rect.left
            const mouseY = event.clientY - rect.top

            const width = rect.width
            const height = rect.height

            // Convert mouse position to canvas coordinates ranging from -1 to 1
            const unitX = mouseX / width
            const unitY = mouseY / height

            lastMousePt = [unitX, unitY]

            // Update control point with the converted coordinates
            didChangeCallback([unitX, unitY], isMouseDown)
        }
    })

    didChangeCallback(lastMousePt, false)
}
