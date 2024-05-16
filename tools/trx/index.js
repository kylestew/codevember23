/* https://medium.com/@thi.ng/of-umbrellas-transducers-reactive-streams-mushrooms-pt-2-9c540beb0023 */

// export function transduce(transformer, reducer, initialAccumulator, values) {
//     // Create a transduced reducer
//     const transducedReducer = (acc, value) => reducer(acc, transformer(value))

//     // Apply the transduced reducer to the values array
//     return values.reduce(transducedReducer, initialAccumulator)
// }

// processes and returns arrays
export function transformer(transformations, data) {
    // for each piece of data, take through transformation pipeline
    // return transformations.reduce((data, transformFn) => {
    //     return transformFn(data)
    //     // return data.flatMap((item) => {
    //     //     const transformed = transformFn(item)
    //     //     // Flatten if requested
    //     //     // if (transformFn.flatten) {
    //     //     //     return transformed
    //     //     // }
    //     //     return [transformed]
    //     // })
    // }, initialData)
}

export function partial(func, ...fixedArgs) {
    return function (threadedArg) {
        if (Array.isArray(threadedArg)) {
            return threadedArg.map((arg) => func(arg, ...fixedArgs))
        } else {
            return func(threadedArg, ...fixedArgs)
        }
    }
}

export function trace() {
    return (input) => {
        console.log(input)
        return input
    }
}

// TODO: use this workflow but automatically partial the function
// const output = transformer(
//     [
//         // shrink each grid
//         partial(offset, -0.05),
//         // split into edges
//         //         //         _edges(),
//         //         //         // pick random edge pairs (opposites)
//         //         //         // TODO: pick random evens odds FN
//         //         //         (edges) => (Math.random() < 0.5 ? [edges[3], edges[1].reverse()] : [edges[0], edges[2].reverse()]),
//         //         //         // edges become lines
//         //         //         _line(),
//         //         //         // resample lines as points
//         //         //         partial(asPoints, innerLines),
//         //         //         // connect points as new set of lines
//         //         //         _zip(),
//         //         //         _line({ stroke: primary, weight: 0.01 }),
//         //         //         // TODO: simplify some of the map operations
//         trace(),
//         _debugDraw(ctx),
//     ],
//     grid([-1, -1], [2, 2], rowsCols, rowsCols).rects()
// )

// function _offset(...args) {
//     return partial(offset, ...args)
// }
// function _edges(...args) {
//     return partial(edges, ...args)
// }
// function _line(...args) {
//     return partial(line, ...args)
// }
// function _zip() {
//     return (input) => zip(input[0], input[1])
// }
// function flatten() {
//     const fn = (input) => {
//         return input
//     }
//     fn.flatten = true
//     return fn
// }

// function flatten() {
//     const fn = (input) => {
//         return input
//     }
//     fn.flatten = true
//     return fn
// }
