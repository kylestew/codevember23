/**
 * === MATH UTILS ===
 *
 * mapRange - maps a value from one range to another
 * lerpPt - linearly interpolates between two points
 * clamp - clamps a value between a minimum and maximum
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

/**
 * Linearly interpolates between two points.
 *
 * @param {number[]} pt1 - The first point.
 * @param {number[]} pt2 - The second point.
 * @param {number} pct - The interpolation percentage (between 0 and 1).
 * @returns {number[]} The interpolated point.
 */
export function lerpPt(pt1, pt2, pct) {
    return [pt1[0] + (pt2[0] - pt1[0]) * pct, pt1[1] + (pt2[1] - pt1[1]) * pct]
}

/**
 * Clamps a value between a minimum and maximum.
 *
 * @param {number} value - The value to be clamped.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The clamped value.
 */
export function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max)
}
