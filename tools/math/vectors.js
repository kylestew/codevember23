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

export const mulN = (v, n) => v.map((x) => x * n)

export const neg = (v) => mulN(v, -1)
