/**
 * === MATH UTILS ===
 *
 * mapRange - maps a value from one range to another
 */

/**
 * Maps a value from one range to another range.
 *
 * @param {number} value - The value to be mapped.
 * @param {number} low1 - The lower bound of the input range.
 * @param {number} high1 - The upper bound of the input range.
 * @param {number} low2 - The lower bound of the output range.
 * @param {number} high2 - The upper bound of the output range.
 * @returns {number} The mapped value.
 */
export function mapRange(value, low1, high1, low2, high2) {
    // Calculate the ratio of the difference between the value and low1
    // to the total range (high1 - low1)
    let ratio = (value - low1) / (high1 - low1)

    // Apply the ratio to the new range (high2 - low2) and add the low2
    // to scale and shift the value appropriately
    return ratio * (high2 - low2) + low2
}
