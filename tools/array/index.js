/**
 * === Array Utils ===
 *
 * full(count, callbackOrValue) - Prefills a new array with values returned by a callback function or a provided value.
 * linspace(start, stop, num, endpoint) - Generates an array of numbers within a specified range.
 * range(from, to, step) - Generates an array of numbers within a specified range.
 * range2d(xRange, yRange, stepX, stepY) - Generates a 2D range array based on the given x and y ranges.
 * partition(data, size, step, partial) - Creates overlapping and non-overlapping sliding windows of inputs.
 * wrapSides(src, numLeft, numRight) - Wraps elements from the start and end of an array to the other side.
 * shuffle(array) - Shuffles the elements of an array in place.
 * interleave(array1, array2) - Interleaves two arrays by alternating their elements.
 * zip(arr1, arr2) - Zips two arrays together, creating an array of pairs.
 * rotate(array, positions) - Rotates an array by a given number of positions.
 * takeEvery(array, n) - Takes every nth element from an array and returns a new array.
 */

/**
 * Prefills a new array with values returned by a callback function or a provided value.
 *
 * @param {number} count - The number of elements to prefill the array with.
 * @param {Function|any} callbackOrValue - The callback function or value that returns the value for each element.
 * @returns {Array} - The prefilled array.
 */
export function full(count, callbackOrValue) {
    const result = []
    for (let i = 0; i < count; i++) {
        if (typeof callbackOrValue === 'function') {
            result.push(callbackOrValue())
        } else {
            result.push(callbackOrValue)
        }
    }
    return result
}

/**
 * Generates an array of numbers within a specified range.
 *
 * @param {number} start - The starting value of the range.
 * @param {number} stop - The ending value of the range.
 * @param {number} num - The number of elements in the range.
 * @param {boolean} [endpoint=true] - Whether or not to include the endpoint in the range.
 * @returns {Array} - The generated range array.
 */
export function linspace(start, stop, num, endpoint = true) {
    const step = (stop - start) / (num - (endpoint ? 1 : 0))
    const result = []
    for (let i = 0; i < num; i++) {
        result.push(start + i * step)
    }
    return result
}

/**
 * Generates an array of numbers within a specified range.
 *
 * @param {number} from - The starting number of the range.
 * @param {number} to - The ending number of the range.
 * @param {number} [step=1] - The increment value between numbers in the range.
 * @returns {number[]} - An array of numbers within the specified range.
 * @throws {Error} - If the step size is not positive.
 */
export function range(from, to, step = 1) {
    // overload arguments
    if (arguments.length === 1) {
        to = from
        from = 0
    }
    if (step <= 0) {
        throw new Error('Step size must be positive')
    }

    var res = []
    for (var i = from; i < to; i += step) {
        res.push(i)
    }
    return res
}

/**
 * Generates a 2D range array based on the given x and y ranges.
 * @param {number|Array<number>} xRange - The range of values for the x-axis. Can be a single number or a tuple [start, end].
 * @param {number|Array<number>} yRange - The range of values for the y-axis. Can be a single number or a tuple [start, end].
 * @param {number} [stepX=1] - The step size for the x-axis.
 * @param {number} [stepY=1] - The step size for the y-axis.
 * @returns {Array<Array<number>>} - The generated 2D range array.
 * @throws {Error} - If the xRange or yRange arguments are invalid.
 */
export function range2d(xRange, yRange, stepX = 1, stepY = 1) {
    // Handle xRange being a single number or a tuple
    let startX, endX
    if (Array.isArray(xRange) && xRange.length === 2) {
        ;[startX, endX] = xRange
    } else if (typeof xRange === 'number') {
        startX = 0
        endX = xRange
    } else {
        throw new Error('Invalid xRange argument: must be a number or a tuple [start, end]')
    }

    // Handle yRange being a single number or a tuple
    let startY, endY
    if (Array.isArray(yRange) && yRange.length === 2) {
        ;[startY, endY] = yRange
    } else if (typeof yRange === 'number') {
        startY = 0
        endY = yRange
    } else {
        throw new Error('Invalid yRange argument: must be a number or a tuple [start, end]')
    }

    // Generate the 2D range array
    const result = []
    for (let y = startY; y <= endY; y += stepY) {
        for (let x = startX; x <= endX; x += stepX) {
            result.push([x, y])
        }
    }
    return result
}

/**
 * Creates overlapping and non-overlapping sliding windows
 * of inputs. Window size and progress speed can be configured via
 * `size` and `step`. By default only full / complete partitions are
 * emitted.
 *
 * @example
 * ```ts
 *
 * [...partition(3, range(10))]
 * // [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ]
 *
 * [...partition(3, true, range(10))]
 * // [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], [ 9 ] ]
 *
 * [...partition(3, 1, range(10))]
 * // [ [ 0, 1, 2 ],
 * //   [ 1, 2, 3 ],
 * //   [ 2, 3, 4 ],
 * //   [ 3, 4, 5 ],
 * //   [ 4, 5, 6 ],
 * //   [ 5, 6, 7 ],
 * //   [ 6, 7, 8 ],
 * //   [ 7, 8, 9 ] ]
 * ```
 *
 * @param size -
 * @param step -
 * @param partial -
 */
export function partition(data, size, step, partial) {
    if (step === void 0) {
        step = 1
    }
    if (partial === void 0) {
        partial = false
    }
    var res = []
    var n = data.length
    if (size <= 0 || step <= 0) {
        return res
    }
    if (size > n) {
        return partial ? [data] : []
    }
    var max = n - size
    for (var i = 0; i <= max; i += step) {
        res.push(data.slice(i, i + size))
    }
    if (partial && max % step !== 0) {
        res.push(data.slice(max))
    }
    return res
}

/**
 * Wraps elements from the start and end of an array to the other side.
 * @param {Array} src - The source array.
 * @param {number} numLeft - Number of elements to wrap from the right end to the start.
 * @param {number} numRight - Number of elements to wrap from the left end to the end.
 * @returns {Array} - The new array with wrapped elements.
 */
export function wrapSides(src, numLeft = 1, numRight = 0) {
    if (!Array.isArray(src)) {
        throw new Error('src must be an array')
    }

    const len = src.length
    if (numLeft < 0 || numRight < 0 || numLeft > len || numRight > len) {
        throw new Error(`allowed wrap range: [0..${len}]`)
    }

    const result = []

    // Add elements from the end to the start
    for (let i = len - numLeft; i < len; i++) {
        result.push(src[i])
    }

    // Add the original elements
    result.push(...src)

    // Add elements from the start to the end
    for (let i = 0; i < numRight; i++) {
        result.push(src[i])
    }

    return result
}

/**
 * Shuffles the elements of an array in place.
 *
 * Shuffling an array in JavaScript can be effectively achieved using the Fisher-Yates (or Knuth) shuffle algorithm. This method ensures each permutation of the array is equally likely, making it a good choice for a fair and unbiased shuffle.
 *
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} - The shuffled array.
 */
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1))
        // Swap elements at indices i and j
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

/**
 * Interleaves two arrays by alternating their elements.
 * @param {Array} array1 - The first array.
 * @param {Array} array2 - The second array.
 * @returns {Array} - The interleaved array.
 */
export function interleave(array1, array2) {
    const result = []
    const maxLength = Math.max(array1.length, array2.length)

    for (let i = 0, j = 0; i < array1.length || j < array2.length; ) {
        if (i < array1.length) {
            result.push(array1[i++])
        }
        if (j < array2.length) {
            result.push(array2[j++])
        }
    }

    return result
}

/**
 * Zips multiple arrays together, creating an array of tuples.
 * Stops at the shortest array length when arrays are uneven.
 *
 * @param {...Array} arrays - The arrays to zip together.
 * @returns {Array} - The zipped array.
 */
export function zip(...arrays) {
    const minLength = Math.min(...arrays.map((arr) => arr.length))
    const zipped = []

    for (let i = 0; i < minLength; i++) {
        zipped.push(arrays.map((arr) => arr[i]))
    }

    return zipped
}

/**
 * Rotates an array by a given number of positions.
 *
 * @param {Array} array - The array to be rotated.
 * @param {number} positions - The number of positions to rotate the array. Positive values rotate to the right, negative values rotate to the left.
 * @returns {Array} - The rotated array.
 */
export function rotate(array, positions) {
    const length = array.length
    const normalizedPositions = positions % length
    if (normalizedPositions === 0) {
        return array
    }
    const rotatedArray = []
    for (let i = 0; i < length; i++) {
        const newIndex = (i + normalizedPositions + length) % length
        rotatedArray[newIndex] = array[i]
    }
    return rotatedArray
}

/**
 * Takes every nth element from an array and returns a new array.
 *
 * @param {Array} array - The input array.
 * @param {number} n - The number of elements to skip between each selected element.
 * @returns {Array} - A new array containing every nth element from the input array.
 */
export function takeEvery(array, n) {
    const result = []
    for (let i = 0; i < array.length; i += n) {
        result.push(array[i])
    }
    return result
}

/**
 * Splits an array into smaller arrays of size N.
 *
 * @param {Array} array - The array to be split.
 * @param {number} n - The size of each smaller array.
 * @returns {Array} - An array of smaller arrays.
 */
export function splitArray(array, n) {
    const result = []
    for (let i = 0; i < array.length; i += n) {
        result.push(array.slice(i, i + n))
    }
    return result
}

/**
 * Removes a random number of elements from an array.
 *
 * @param {Array} array - The array from which elements will be removed.
 * @param {number} numToRemove - The number of elements to remove.
 * @returns {Array} - A new array with the randomly selected elements removed.
 */
export function randomRemove(array, numToRemove) {
    // Make sure not to remove more elements than are in the array
    if (numToRemove >= array.length) {
        return []
    }

    // Create a copy of the array to avoid modifying the original array
    let arrCopy = array.slice()

    // Keep track of indices that have been removed
    let removedIndices = new Set()

    // Randomly select indices to remove
    while (removedIndices.size < numToRemove) {
        let randomIndex = Math.floor(Math.random() * arrCopy.length)
        removedIndices.add(randomIndex)
    }

    // Remove the selected elements by creating a new array
    let result = arrCopy.filter((_, index) => !removedIndices.has(index))

    return result
}
