// import { add } from '../../tools/math/vectors'

// type Point = [number, number]

// interface Geometry {
//     pt_indices: number[]
//     closed: boolean
//     // EXTRA attrs for things like circles: radius, etc
// }

interface TexContextData {
    // readonly pts: Point[]
    // readonly geo: Geometry[]
}

// const emptyDataStream: DataStream = { pts: [], geo: [] }
// function prepDataStream(data: DataStream | null): DataStream {
//     return JSON.parse(JSON.stringify(data ?? emptyDataStream))
// }

export function createCanvas(width: number, height: number, clearColor: string): TexContextData {
    return {}
}
