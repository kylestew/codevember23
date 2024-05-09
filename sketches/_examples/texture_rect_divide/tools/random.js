export function randomInArray(arr) {
    if (arr.length === 0) {
        throw new Error('Array is empty')
    }
    return arr[Math.floor(Math.random() * arr.length)]
}

export function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min
}

export function randomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

export function randomCoinToss() {
    return Math.random() < 0.5
}

/**
 * Generates a random number from a Gaussian distribution.
 * @returns {number} The random number.
 */
export function gaussianRandom() {
    let u = 0,
        v = 0
    while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

/**
 * Generates a random number from a normal distribution.
 *
 * @param {number} mu - The mean of the distribution.
 * @param {number} sigma - The standard deviation of the distribution.
 * @returns {number} The randomly generated number.
 */
export function randomNormal(mu, sigma) {
    return mu + sigma * gaussianRandom()
}

/**
 * Generates a random number from a truncated Gaussian distribution.
 *
 * @param {number} mean - The mean value of the distribution.
 * @param {number} sigma - The standard deviation of the distribution.
 * @param {number} lower - The lower bound of the truncated range.
 * @param {number} upper - The upper bound of the truncated range.
 * @returns {number} - The generated random number.
 */
export function truncatedGaussian(mean, sigma, lower, upper) {
    let result
    do {
        result = mean + sigma * gaussianRandom() // Use the gaussianRandom function previously discussed
    } while (result < lower || result > upper)
    return result
}
