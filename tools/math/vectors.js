/* === VECTOR UTILS ===
 *
 * add - Adds two vectors
 * div - Divides two vectors
 * mul - Multiplies two vectors
 * sub - Subtracts two vectors
 * dot - Dot product of two vectors
 *
 * addN - Adds scalar to vector
 * divN - Divides vector by scalar
 * mulN - Multiplies vector by scalar
 * subN - Subtracts scalar from vector
 * neg - Negate a vector
 */

export const add = (v1, v2) => v1.map((x, i) => x + v2[i])
export const mul = (v1, v2) => v1.map((x, i) => x * v2[i])

export const subN = (v, n) => v.map((x) => x - n)
export const mulN = (v, n) => v.map((x) => x * n)

export const neg = (v) => mulN(v, -1)

export const floor = (v) => v.map(Math.floor)
export const ceil = (v) => v.map(Math.ceil)
