type Point = [number, number]
type Geometry = any

interface DataStream {
    pts: Point[]
    geo: any[]
}

export function range2d(
    _data: DataStream,
    xRange: [number, number],
    yRange: [number, number],
    stepX = 1,
    stepY = 1
): DataStream {
    let [startX, endX] = xRange
    let [startY, endY] = yRange

    for (let y = startY; y < endY; y += stepY) {
        for (let x = startX; x < endX; x += stepX) {
            _data.pts.push([x, y])
        }
    }

    return _data
}

export function copyToPoints(_data: DataStream, geo: any): DataStream {
    // TODO: consumes all points and converts to geo
    for (let pt of _data.pts) {
        // TODO: need to copy geo and translate to pt
        _data.geo.push(geo)
    }
    _data.pts = []

    return _data
}

export function line(_data: DataStream, pt1, pt2) {
    _data.geo.push()

    // data.pts.push(pt1, pt2)
    // data.prims.push(new Line(pt1, pt2))
    // return data
}
