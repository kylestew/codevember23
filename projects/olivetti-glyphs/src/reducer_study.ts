// import { Path, pathFromSvg, asPolygon, vertices, points } from '@thi.ng/geom'
// import { parse as parseXML, Type } from '@thi.ng/sax'
// import { parse } from 'opentype.js'
// import { comp, mapcat, transduce, map, filter, push } from '@thi.ng/transducers'

// HOF to build & return a preconfigured multiplier func
// const mul = (n) => (x) => x * n
// const result = [1, 2, 3, 4].filter((x) => x & 1).map(mul(14))

// const map = (src, f) => src.reduce((acc, x) => (acc.push(f(x)), acc), [])
// const result = map([0, 1, 3, 6, 10, 15], mul(2))
// console.log(result)

// =========================================
interface Reducer<A, B> {
    // Initilization: initial accumulator value if no initial value provided
    [0]: () => A
    // Completion: when called usually just returns `acc`
    [1]: (acc: A) => A
    // Reduction: combines new input with accumulator
    [2]: (acc: A, x: B) => A
}

const reduce = (reducer: any, initial: any, xs: any) => {
    // use reducer's default init if not user provided
    let acc = initial != null ? initial : reducer[0]()
    // reduce all inputs
    for (let x of xs) {
        acc = reducer[2](acc, x)
    }
    // call completion fn to post-process final result
    return reducer[1](acc)
}

const sum = () => [
    () => 0, //
    (acc: any) => acc, //
    (acc: any, x: any) => acc + x,
]
const histogram = () => [
    () => ({}), //
    (acc: any) => acc, //
    (acc: any, x: any) => (acc[x] ? acc[x]++ : (acc[x] = 1), acc),
]

// ES6 generator to produce `n` random values from given `opts`
function* choices<T>(opts: ArrayLike<T>, n: number) {
    while (--n >= 0) {
        yield opts[(Math.random() * opts.length) | 0]
    }
}

// const result = [...choices('abcd', 10)]
const result = reduce(histogram(), null, choices('abcd', 100))

// // const result = [0, 1, 3, 6, 10, 15].reduce((acc, val) => acc + val, 0)
console.log(result)

// COMPOSE functions
// const fn = comp(
// )

// console.log(fn(['a', 'abc', 'abcdefg']))
console.log(
    transduce(
        comp(
            filter((x) => x.length > 3), //
            map((x) => x.toUpperCase())
        ),
        push(),
        ['a', 'abc', 'abcdefg']
    )
)

// load font
import fontFileURL from './assets/FiraSansOT-Medium.otf?url'
const response = await fetch(fontFileURL)
const buffer = await response.arrayBuffer()
const font = parse(buffer)

// setup a canvas and draw the control points of the font
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
// resize canvas to 800 x 800
canvas.width = canvas.height = 800
// font.drawPoints(ctx, 'H', 300, 400, 256)

// convert opentype to SVG
const otPath = font.getPath('A', 300, 400, 256)
const svgPathElement: string = otPath.toSVG()
// console.log(svgPathElement)

// ES6 generator to produce `n` random values from given `opts`
// function* lettersToSVG(letters: ArrayLike<string>) {
//     for (let idx = 0; idx < letters.length; idx++) {
//         yield font.getPath(letters[idx], 0, 0, 256).toSVG()
//     }
// }

// import svgURL from './assets/example.svg?url'
// const raw = await fetch(svgURL)
// console.log(await raw.text())
// const buffer = await response.arrayBuffer()
// const font = parse(buffer)

const pathGroups = transduce(
    comp(
        mapcat((letter) => font.getPath(letter, 0, 0, 256).toSVG()),
        parseXML(), //
        filter((ev) => ev.type === Type.ELEM_END && ev.tag === 'path'),
        map((ev) => pathFromSvg(ev.attribs!.d))
    ),
    push<Path>(),
    ['A', 'B']
)
console.log(pathGroups)

// const xml = parseXML(svgPathElement)
// // // get next item from xml iterator
// // // TODO: use a transducer?
// const pathElement = xml.next().value
// const pathData = pathElement.attribs.d
// const path = pathFromSvg(pathData)[0]
// console.log(path)

for (let group of pathGroups) {
    ctx?.translate(100, 200)

    for (const path of group) {
        // we have or path, now resample points on it
        TODO: more evenly spaced points please
        const pts = points(vertices(asPolygon(path)))

        // draw all points in canvas
        for (const p of pts) {
            ctx.fillStyle = 'black'
            ctx.fillRect(p[0], p[1], 1, 1)
        }
    }
}

// const d =
// 'M450.53 400L450.53 223.10L416.48 223.10L416.48 294.02L355.55 294.02L355.55 223.10L321.50 223.10L321.50 400L355.55 400L355.55 320.90L416.48 320.90L416.48 400Z'
// const path = pathFromSvg(d)
// console.log(path)

// TODO: convert this path to thing geom path

// for (const p of pts.slice(10, 20)) {
//     // measure size of text
//     const m = ctx.measureText('A')
//     console.log(m)
//     // draw text centered at sample point
//     ctx.fillStyle = 'black'
//     ctx.fillText('A', p[0], p[1])
//     // draw bounding box for text in red
//     ctx.strokeStyle = 'red'
//     ctx.strokeRect(
//         p[0] - m.width / 2,
//         p[1] - m.actualBoundingBoxAscent,
//         m.width,
//         m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
//     )
// }
document.body.appendChild(canvas)

// import { asSvg, circle, svgDoc } from '@thi.ng/geom'
// import { KdTreeSet } from '@thi.ng/geom-accel'
// import { fit01 } from '@thi.ng/math'
// import { samplePoisson } from '@thi.ng/poisson'
// import { dist, randMinMax2 } from '@thi.ng/vectors'

// const index = new KdTreeSet(2)
// const pts = samplePoisson({
//     index,
//     points: () => randMinMax2(null, [0, 0], [500, 500]),
//     density: (p) => fit01(Math.pow(dist(p, [250, 250]) / 250, 2), 8, 20),
//     iter: 10,
//     max: 2000,
//     quality: 2000,
// })

// console.log(pts.slice(0, 10))

// select a font and place a character at each sample point
// const font = new FontFace('Olivetti', 'url(olivetti.ttf)')
// await font.load()
// document.fonts.add(font)
/*
ctx.font = '48px Olivetti'
for (const p of pts.slice(10, 20)) {
    // measure size of text
    const m = ctx.measureText('A')
    console.log(m)
    // draw text centered at sample point
    ctx.fillStyle = 'black'
    ctx.fillText('A', p[0], p[1])
    // draw bounding box for text in red
    ctx.strokeStyle = 'red'
    ctx.strokeRect(
        p[0] - m.width / 2,
        p[1] - m.actualBoundingBoxAscent,
        m.width,
        m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
    )
}
document.body.appendChild(canvas)

// use thi.ng/geom to visualize results
// each circle's radius is set to distance to its nearest neighbor
// const circles = pts.map((p) => circle(p, dist(p, index.queryKeys(p, 40, 2)[1]) / 2))

// document.body.innerHTML = asSvg(svgDoc({ fill: 'none', stroke: 'blue' }, ...circles))
*/