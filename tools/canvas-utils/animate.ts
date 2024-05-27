export function animate(fps: number, callback: (deltaTime: number) => void) {
    const frameDuration = 1000 / fps // Duration of each frame in milliseconds

    let lastFrameTime = 0
    function nextFrame(timestamp) {
        if (timestamp - lastFrameTime < frameDuration) {
            requestAnimationFrame(nextFrame)
            return
        }
        lastFrameTime = timestamp

        callback(timestamp)

        requestAnimationFrame(nextFrame)
    }
    requestAnimationFrame(nextFrame)
}
