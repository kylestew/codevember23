// import { SketchParams } from '../types'
// import { transduce, pluck, trace, flatten, map, mapcat, filter, push, comp } from '@thi.ng/transducers'
// import { PathSegment } from '@thi.ng/geom-api'
// import { Font } from 'opentype.js'
import { GlyphMaker } from '../libs/glyphs/GlyphMaker'
import { Path, path, pathFromSvg, centroid, bounds, translate } from '@thi.ng/geom'
import { pickRandom } from '@thi.ng/random'
import { Vec } from '@thi.ng/vectors'

// export class FontGlyphMaker extends GlyphMaker {
//     fontSet: Font[]
//     characterSet: string[]

//     constructor(
//         count: number,
//         attempts: number,

//         minScale: number,
//         maxScale: number,
//         scaleStepSize: number,
//         fontSet: Font[],
//         characterSet: string[],
//         placementRule: () => Vec,
//         rotationRule: () => number,
//         hollowRule: () => boolean
//     ) {
//         super(count, attempts, minScale, maxScale, scaleStepSize, placementRule, rotationRule, hollowRule)
//         this.fontSet = fontSet
//         this.characterSet = characterSet
//     }

//     randomPath(): Path {
//         const font = pickRandom(this.fontSet)
//         const letter = pickRandom(this.characterSet)

//         const segments = transduce(
//             comp(
//                 // opentype to SVG string
//                 map((letter) => font.getPath(letter, 0, 0, 64.0).toPathData(4)),
//                 // trace(),
//                 // convert path string to geom.Path objects
//                 mapcat((d) => pathFromSvg(d)),
//                 // trace(),
//                 // flatten segments
//                 mapcat((path) => path.segments)
//                 // trace()
//             ),
//             push<PathSegment>(),
//             [letter]
//         )

//         // center the path on itself
//         let centeredPath = path(segments)
//         const cent = centroid(bounds(centeredPath))
//         return translate(centeredPath, [-cent[0], -cent[1]]) as Path
//     }
// }
