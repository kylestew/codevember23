export function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min
}
export function randomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
export function pickRandom(arr) {
    if (arr.length === 0) {
        throw new Error('Array is empty')
    }
    return arr[Math.floor(Math.random() * arr.length)]
}

export function mapRange(value, low1, high1, low2, high2) {
    // Calculate the ratio of the difference between the value and low1
    // to the total range (high1 - low1)
    let ratio = (value - low1) / (high1 - low1)

    // Apply the ratio to the new range (high2 - low2) and add the low2
    // to scale and shift the value appropriately
    return ratio * (high2 - low2) + low2
}

export function rotateRight(arr) {
    if (arr.length > 0) {
        const lastElement = arr.pop() // Remove the last element
        arr.unshift(lastElement) // Insert it at the beginning
    }
    return arr
}
export function rotateLeft(arr) {
    if (arr.length > 0) {
        const firstElement = arr.shift() // Remove the first element
        arr.push(firstElement) // Insert it at the end
    }
    return arr
}
export function chunkArray(arr, chunkSize) {
    let result = []
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize))
    }
    return result
}
