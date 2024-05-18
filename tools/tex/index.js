export function canvasToPixelCoordinates(ctx, pt) {
    const [x, y] = pt

    // Get the current transformation matrix
    const transform = ctx.getTransform()

    // Create a point object with the input coordinates
    const point = new DOMPoint(x, y)

    // Apply the inverse transformation to the point
    const transformedPoint = transform.transformPoint(point)

    // Return the original canvas coordinates
    return [transformedPoint.x, transformedPoint.y]
}
