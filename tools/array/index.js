/**
 * Creates overlapping and non-overlapping sliding windows
 * of inputs. Window size and progress speed can be configured via
 * `size` and `step`. By default only full / complete partitions are
 * emitted.
 *
 * @example
 * ```ts
 *
 * [...partition(3, range(10))]
 * // [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ]
 *
 * [...partition(3, true, range(10))]
 * // [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], [ 9 ] ]
 *
 * [...partition(3, 1, range(10))]
 * // [ [ 0, 1, 2 ],
 * //   [ 1, 2, 3 ],
 * //   [ 2, 3, 4 ],
 * //   [ 3, 4, 5 ],
 * //   [ 4, 5, 6 ],
 * //   [ 5, 6, 7 ],
 * //   [ 6, 7, 8 ],
 * //   [ 7, 8, 9 ] ]
 * ```
 *
 * @param size -
 * @param step -
 * @param partial -
 */
export function partition(data, size, step, partial) {
    if (step === void 0) {
        step = 1
    }
    if (partial === void 0) {
        partial = false
    }
    var res = []
    var n = data.length
    if (size <= 0 || step <= 0) {
        return res
    }
    if (size > n) {
        return partial ? [data] : []
    }
    var max = n - size
    for (var i = 0; i <= max; i += step) {
        res.push(data.slice(i, i + size))
    }
    if (partial && max % step !== 0) {
        res.push(data.slice(max))
    }
    return res
}
