/**
 * === RANDOM UTILS ===
 *
 * random(min, max) - generates a random number between the specified minimum and maximum values
 * randomInt(min, max) - generates a random integer between the specified minimum and maximum values
 * pickRandom(arr) - picks a random element from an array
 * randomPoint(min, max) - generates a random point within a specified range
 */

/**
 * Generates a random number between the specified minimum and maximum values.
 * If only one argument is provided, it is assumed to be the maximum value and the minimum value is set to 0.
 *
 * @param {number} [min=0] - The minimum value (inclusive). Defaults to 0 if not provided.
 * @param {number} [max=1] - The maximum value (exclusive). Defaults to 1 if not provided.
 * @returns {number} - A random number between min and max.
 */
export function random(min = 0, max = 1) {
    if (arguments.length === 1) {
        // assume the user passed in a max value
        max = min
        min = 0
    }
    // Return a random number between min and max
    return Math.random() * (max - min) + min
}

export function randomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

/**
 * Picks a random unique element or elements from an array.
 *
 * @param {Array} arr - The array to pick elements from.
 * @param {number} [num=1] - The number of elements to pick. Defaults to 1 if not provided.
 * @returns {Array} - An array containing the randomly picked unique element(s).
 */
export function pickRandom(arr, num = 1) {
    if (arr.length === 0) {
        throw new Error('Array is empty')
    }
    if (num > arr.length) {
        throw new Error('Number of elements to pick exceeds array length')
    }
    const pickedElements = []
    const availableIndices = Array.from(Array(arr.length).keys()) // Create an array of indices from 0 to arr.length - 1
    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length)
        const pickedIndex = availableIndices.splice(randomIndex, 1)[0] // Remove the picked index from availableIndices and get its value
        pickedElements.push(arr[pickedIndex])
    }

    if (num === 1) {
        return pickedElements[0]
    }
    return pickedElements
}

/**
 * Generates a random point within a specified range.
 *
 * @param {Array<number>} [min=[0, 0]] - The minimum values for x and y coordinates.
 * @param {Array<number>} [max=[1, 1]] - The maximum values for x and y coordinates.
 * @returns {Array<number>} The randomly generated point as an array of [x, y] coordinates.
 */
export function randomPoint(min = [0, 0], max = [1, 1]) {
    if (arguments.length === 1) {
        // assume the user passed in a max value
        max = min
        min = [0, 0] // Set min to the origin if only one argument is provided
    }

    // Return a random point where each component is calculated separately
    const x = Math.random() * (max[0] - min[0]) + min[0]
    const y = Math.random() * (max[1] - min[1]) + min[1]
    return [x, y]
}

/**
 * Generates a random offset within the specified range.
 *
 * @param {number} maxX - The maximum value for the X-axis.
 * @param {number} [maxY=maxX] - The maximum value for the Y-axis. If not provided, it defaults to the value of maxX.
 * @returns {number[]} An array containing the random X and Y offsets.
 */
export function randomOffset(maxX, maxY) {
    if (arguments.length === 1) {
        maxY = maxX
    }
    return [random(-maxX, maxX), random(-maxY, maxY)]
}

/**
 * Generates a random index from an array of weights.
 *
 * @param {Array<number>} weights - The array of weights.
 * @returns {number} - The index of the selected weight.
 */
export function weightedRandom(weights) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    const randomValue = Math.random() * totalWeight
    let cumulativeWeight = 0

    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i]
        if (randomValue < cumulativeWeight) {
            return i
        }
    }

    throw new Error('Unable to determine weighted random index')
}
