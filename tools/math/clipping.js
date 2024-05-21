export function pointClipLogarithmic(point, maxDistance) {
    const [x, y] = point
    const distance = Math.sqrt(x * x + y * y)
    const clippedDistance = maxDistance * Math.log(1 + distance / maxDistance)
    const scale = clippedDistance / distance
    return [x * scale, y * scale]
}

function sigmoid(t) {
    return 1 / (1 + Math.exp(-t))
}

export function pointClipSigmoid(point, maxDistance) {
    const [x, y] = point
    const distance = Math.sqrt(x * x + y * y)
    const t = distance / maxDistance
    const softT = sigmoid(t)
    return [x * softT, y * softT]
}

export function pointClipExponential(point, maxDistance) {
    const [x, y] = point
    const distance = Math.sqrt(x * x + y * y)
    const clippedDistance = maxDistance * (1 - Math.exp(-distance / maxDistance))
    const scale = clippedDistance / distance
    return [x * scale, y * scale]
}

function smoothstep(t) {
    return t * t * (3 - 2 * t)
}

export function pointClipSmooth(point, maxDistance) {
    const [x, y] = point
    const distance = Math.sqrt(x * x + y * y)
    // const t = Math.min(distance / maxDistance, 1.0)
    const t = distance / maxDistance
    const softT = smoothstep(t)
    return [x * softT, y * softT]
}
