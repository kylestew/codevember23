export function color(value) {
    // Utility function to convert hex to RGB
    function hexToRgb(hex) {
        // Remove the leading # if present
        hex = hex.replace(/^#/, '')

        // If shorthand form (e.g. "03F") is used, convert to full form ("0033FF")
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((char) => char + char)
                .join('')
        }

        const bigint = parseInt(hex, 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255

        return { r, g, b, a: 1 } // assuming full opacity if not specified
    }

    // Utility function to convert RGB to Hex
    function rgbToHex({ r, g, b }) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
    }

    // Utility function to convert RGBA to CSS string
    function rgbaToString({ r, g, b, a }) {
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    // Parse the input color value
    let colorObj
    if (typeof value === 'string') {
        if (value.startsWith('#')) {
            colorObj = hexToRgb(value)
        } else if (value.startsWith('rgba')) {
            const match = value.match(/rgba\((\d+), (\d+), (\d+), ([0-9.]+)\)/)
            if (match) {
                colorObj = {
                    r: parseInt(match[1], 10),
                    g: parseInt(match[2], 10),
                    b: parseInt(match[3], 10),
                    a: parseFloat(match[4]),
                }
            }
        } else if (value.startsWith('rgb')) {
            const match = value.match(/rgb\((\d+), (\d+), (\d+)\)/)
            if (match) {
                colorObj = {
                    r: parseInt(match[1], 10),
                    g: parseInt(match[2], 10),
                    b: parseInt(match[3], 10),
                    a: 1,
                }
            }
        }
    } else if (Array.isArray(value) && value.length === 3) {
        colorObj = {
            r: Math.round(value[0] * 255.0),
            g: Math.round(value[1] * 255.0),
            b: Math.round(value[2] * 255.0),
            a: 1.0,
        }
    } else if (Array.isArray(value) && value.length === 4) {
        colorObj = {
            r: Math.round(value[0] * 255.0),
            g: Math.round(value[1] * 255.0),
            b: Math.round(value[2] * 255.0),
            a: value[3],
        }
    } else if (typeof value === 'object') {
        colorObj = value
    }

    return {
        toHex: function () {
            return rgbToHex(colorObj)
        },
        toRgba: function () {
            return rgbaToString(colorObj)
        },
        toGLSL: function () {
            return [colorObj.r / 255, colorObj.g / 255, colorObj.b / 255, colorObj.a]
        },
        toArray: function () {
            return [colorObj.r, colorObj.g, colorObj.b, colorObj.a * 255]
        },
    }
}
