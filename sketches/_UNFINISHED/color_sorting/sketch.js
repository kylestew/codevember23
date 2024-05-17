import { createCanvas } from 'canvas-utils'

let currentRow = 0

function sortLoop() {
    // Dimensions for the slice
    const rowHeight = 1 // Height of the slice in pixels
    const pixelsPerRow = ctx.canvas.width * 4 // Each pixel has 4 data points (RGBA)
    const rowDataStart = currentRow * pixelsPerRow
    const rowDataEnd = rowDataStart + pixelsPerRow

    // Access image pixels for the current row
    const imageData = ctx.getImageData(0, currentRow, ctx.canvas.width, rowHeight)
    const data = imageData.data

    // Manipulate pixels in the row
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i] // Invert Red
        data[i + 1] = 255 - data[i + 1] // Invert Green
        data[i + 2] = 255 - data[i + 2] // Invert Blue
        // Alpha remains unchanged
    }

    // Update the canvas with new image data for the current row
    ctx.putImageData(imageData, 0, currentRow)

    // Increment row count
    currentRow++
    if (currentRow < ctx.canvas.height) {
        setTimeout(sortLoop, 10) // Continue to next row after a short delay
    } else {
        currentRow = 0 // Optionally, reset to start from the top again
    }
}

const ctx = createCanvas(800, 600, 'sketchCanvas')
document.addEventListener('DOMContentLoaded', () => {
    const original = document.getElementById('original')
    original.style.display = 'none' // Hide the element

    original.onload = () => {
        const canvas = ctx.canvas
        canvas.width = original.width
        canvas.height = original.height

        // Draw the image onto the canvas
        ctx.drawImage(original, 0, 0)

        // begin sorting
        sortLoop()
    }

    // Handle potential cross-origin issues when loading images
    original.crossOrigin = 'Anonymous'
})

/*
### SORTING FUNCTIONS ########

def red(val):
    r, _, _ = val[0:3]
    return r

def green(val):
    _, g, _ = val[0:3]
    return 255 - g

def hue(val):
    r, g, b = val[0:3]
    return colorsys.rgb_to_hsv(r, g, b)[0]


def saturation(val):
    [r, g, b] = val[0:3]
    return colorsys.rgb_to_hsv(r, g, b)[1]


def value(val):
    [r, g, b] = val[0:3]
    return colorsys.rgb_to_hsv(r, g, b)[2]


def lumi(val):
    [r, g, b] = val[0:3]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def freaky(val):
    import random

    fns = [lumi, value, hue, saturation]
    fn = random.choice(fns)
    return fn(val)

def random(val):
    import random
    return random.uniform(0.1, 0.01)

##############################

fns = [red, green]


# sort image per row
for row in range(height):
    # define a region to grab
    box = (0, row, width, row + 1)
    strip = np.asarray(img.crop(box))[0]

    # define ordering based on FN
    # keys = [fns[0](itm) for itm in list(strip)]

    # remap indices ordering based on distribution
    # TODO: use a sorting algo to define preference regions?

    # idx = np.clip(np.arange(0, width) + np.random.normal(0.0, 9.0, width), 0, width - 1)
    idx = np.clip(np.random.uniform(0, 1.0, width), 0, width - 1)
    keys = idx.astype(int)
    # print(keys)
    sorted = strip[np.argsort(keys)]

    # return into Pillow image and put back into image
    data = Image.fromarray(np.uint8(sorted.reshape((1, width, bit_depth))))
    img.paste(data, box)


# sort image per column
for col in range(width):
    # define a region to grab
    box = (col, 0, col + 1, height)
    strip = np.asarray(img.crop(box)).reshape((height, bit_depth))

    # sort it
    # keys = [fns[1](itm) for itm in list(strip)]

    # idx = np.clip(np.arange(0, height) + np.random.normal(0.0, 3.0, height), 0, height - 1)
    # idx = np.clip(np.random.rand(1, height), 0, height - 1)
    idx = np.clip(np.random.uniform(0, 1, height), 0, height - 1)
    keys = idx.astype(int)
    sorted = strip[np.argsort(keys)]

    # return into Pillow image and put back into image
    data = Image.fromarray(np.uint8(sorted.reshape((height, 1, bit_depth))))
    img.paste(data, box)

img

# %%
*/
