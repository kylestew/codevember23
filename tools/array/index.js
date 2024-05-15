/**
 * === Array Utils ===
 *
 * full(count, callbackOrValue) - Prefills a new array with values returned by a callback function or a provided value.
 * range(from, to, step) - Generates an array of numbers within a specified range.
 * range2d(xRange, yRange, stepX, stepY) - Generates a 2D range array based on the given x and y ranges.
 * partition(data, size, step, partial) - Creates overlapping and non-overlapping sliding windows of inputs.
 * shuffle(array) - Shuffles the elements of an array in place.
 * interleave(array1, array2) - Interleaves two arrays by alternating their elements.
 * zip(arr1, arr2) - Zips two arrays together, creating an array of pairs.
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
 * Zips two arrays together, creating an array of pairs.
 *
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {Array} - The zipped array.
 */
export function zip(arr1, arr2) {
    const maxLength = Math.max(arr1.length, arr2.length)
    const zipped = []

    for (let i = 0; i < maxLength; i++) {
        zipped.push([arr1[i], arr2[i]])
    }

    return zipped
}
