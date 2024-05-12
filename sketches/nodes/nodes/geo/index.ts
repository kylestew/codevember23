import { add } from '../../tools/math/vectors'

type GeoAttrs = {
    color?: string
    // scale?: number
    // stroke?: string
    // fill?: string
    // lineCap?: string
    // weight?: number
}

export type Point = GeoAttrs & {
    x: number
    y: number
}

type Geometry = GeoAttrs & {
    pt_indices: number[]
    closed: boolean
}

export type GeoContextData = {
    kind: 'geo'
    readonly pts: Point[]
    readonly geo: Geometry[]
}

const emptyDataStream: GeoContextData = { kind: 'geo', pts: [], geo: [] }
function prepDataStream(data: GeoContextData | null): GeoContextData {
    return JSON.parse(JSON.stringify(data ?? emptyDataStream))
}

export function range2d(
    data: GeoContextData | null,
    xRange: [number, number],
    yRange: [number, number],
    stepX = 1,
    stepY = 1
): GeoContextData {
    let _data = prepDataStream(data)

    let [startX, endX] = xRange
    let [startY, endY] = yRange
    for (let y = startY; y < endY; y += stepY) {
        for (let x = startX; x < endX; x += stepX) {
            _data.pts.push([x, y])
        }
    }

    return _data
}

export function line(data: GeoContextData | null, pt1: Point, pt2: Point): GeoContextData {
    let _data = prepDataStream(data)

    _data.pts.push(pt1)
    _data.pts.push(pt2)
    _data.geo.push({
        pt_indices: [_data.pts.length - 2, _data.pts.length - 1],
        closed: false,
    })

    return _data
}

export function setPointAttr(data: GeoContextData, attr: string, value: any): GeoContextData {
    let _data = prepDataStream(data)
    for (let pt of _data.pts) {
        pt[attr] = value
    }
    return _data
}
export function setGeoAttr(data: GeoContextData, attr: string, value: any): GeoContextData {
    let _data = prepDataStream(data)
    for (let pt of _data.geo) {
        pt[attr] = value
    }
    return _data
}

export function copyToPoints(geo_stream: GeoContextData, point_stream: GeoContextData): GeoContextData {
    let outStream = emptyDataStream

    // for every point in the point stream
    for (let pt of point_stream.pts) {
        // copy every geo instance in the geo stream
        for (let geo of geo_stream.geo) {
            // for each point in geo instance
            let newPtIndices: number[] = []
            for (let idx of geo.pt_indices) {
                // add the geo point to the copy point to get the final point
                const newPt = add(geo_stream.pts[idx], pt)
                newPtIndices.push(outStream.pts.push(newPt) - 1)
            }
            // add the new geo instance to the outgoing stream
            outStream.geo.push({ pt_indices: newPtIndices, closed: geo.closed })
        }
    }

    return outStream
}
