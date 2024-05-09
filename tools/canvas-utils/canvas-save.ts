export function installSaveCanvasCommand(canvas: HTMLCanvasElement) {
    document.addEventListener('keydown', function (event) {
        // Check if 'S' is pressed along with the Control key (Ctrl) or Command key (Cmd)
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault() // Prevent the usual handling of Ctrl+S or Cmd+S
            saveCanvas(canvas) // Call the function to save the canvas
        }
    })
}

function saveCanvas(canvas: HTMLCanvasElement) {
    // Create an image from the canvas
    var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')

    // Create a temporary link element
    var link = document.createElement('a')

    // Get the current date to add to the filename
    var date = new Date()
    var dateString =
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getDate().toString().padStart(2, '0') +
        '-' +
        date.getFullYear()

    // Set the filename including the date
    link.download = 'sketch-' + dateString + '.png'
    link.href = image

    // Trigger the download
    link.click()
}
