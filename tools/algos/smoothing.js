// Gaussian Kernel Function
function gaussianKernel(distance, sigma) {
    return Math.exp((-0.5 * (distance * distance)) / (sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI))
}

// Gaussian Kernel 1D Function
function gaussianKernel1D(size, sigma) {
    const kernel = []
    let sum = 0
    const half = Math.floor(size / 2)

    for (let x = -half; x <= half; x++) {
        const g = (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-(x * x) / (2 * sigma * sigma))
        kernel[x + half] = g
        sum += g
    }

    // Normalize the kernel so that the sum is 1
    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= sum
    }

    return kernel
}

// Apply Kernel 1D Function
function applyKernel1D(array, kernel) {
    const length = array.length
    const kSize = kernel.length
    const kHalf = Math.floor(kSize / 2)
    const output = []

    for (let i = 0; i < length; i++) {
        let sum = 0
        for (let k = -kHalf; k <= kHalf; k++) {
            const idx = i + k
            if (idx >= 0 && idx < length) {
                sum += array[idx] * kernel[k + kHalf]
            }
        }
        output[i] = sum
    }

    return output
}

export function smooth(array, kernelSize = 3, sigma = 1.0) {
    const kernel = gaussianKernel1D(kernelSize, sigma)
    return applyKernel1D(array, kernel)
}

/**
 * Smooths an array of points using a Gaussian kernel.
 *
 * @param {Array<Array<number>>} points - The array of points to be smoothed.
 * @param {number} [sigma=1.0] - The standard deviation of the Gaussian kernel ( lower means less smoothing )
 * @returns {Array<Array<number>>} The smoothed array of points.
 */
export function smoothPoints(points, sigma = 1.0) {
    const smoothedPoints = []
    const n = points.length

    for (let i = 0; i < n; i++) {
        let weightedSum = 0
        let weightTotal = 0

        for (let j = 0; j < n; j++) {
            const distance = Math.abs(points[i][0] - points[j][0])
            const weight = gaussianKernel(distance, sigma)
            weightedSum += weight * points[j][1]
            weightTotal += weight
        }

        if (weightTotal !== 0) {
            const smoothedY = weightedSum / weightTotal
            smoothedPoints.push([points[i][0], smoothedY])
        } else {
            smoothedPoints.push([points[i][0], points[i][1]])
        }
    }

    return smoothedPoints
}
