export function mapRange(value, low1, high1, low2, high2) {
    // Calculate the ratio of the difference between the value and low1
    // to the total range (high1 - low1)
    let ratio = (value - low1) / (high1 - low1)

    // Apply the ratio to the new range (high2 - low2) and add the low2
    // to scale and shift the value appropriately
    return ratio * (high2 - low2) + low2
}
