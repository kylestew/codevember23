import { Rectangle, Polygon } from '../shapes.js'

export class Grid {
    constructor(pos, size, rows, cols) {
        this.pos = pos
        this.size = size
        this.rows = rows
        this.cols = cols
    }

    get cellCount() {
        return this.rows * this.cols
    }

    get cellSize() {
        return [this.size[0] / this.cols, this.size[1] / this.rows]
    }

    rects() {
        let [cellWidth, cellHeight] = this.cellSize

        let grid = []
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                grid.push(this.#generateCell(i, j, cellWidth, cellHeight))
            }
        }
        return grid
    }

    centers() {
        let [cellWidth, cellHeight] = this.cellSize

        let centers = []
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let x = this.pos[0] + j * cellWidth + cellWidth / 2
                let y = this.pos[1] + i * cellHeight + cellHeight / 2
                centers.push([x, y])
            }
        }
        return centers
    }

    triangles() {
        let triangles = []
        let [cellWidth, cellHeight] = this.cellSize

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let [x, y] = [this.pos[0] + j * cellWidth, this.pos[1] + i * cellHeight]

                // Define two triangles within each cell
                let tri1 = new Polygon([
                    [x, y],
                    [x + cellWidth, y],
                    [x, y + cellHeight],
                ])
                let tri2 = new Polygon([
                    [x + cellWidth, y],
                    [x + cellWidth, y + cellHeight],
                    [x, y + cellHeight],
                ])

                triangles.push(tri1, tri2)
            }
        }
        return triangles
    }

    staggeredTriangles() {
        let triangles = []
        let [cellWidth, cellHeight] = this.cellSize
        let halfWidth = cellWidth / 2
        let halfHeight = cellHeight / 2

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let baseX = this.pos[0] + j * halfWidth
                let baseY = this.pos[1] + i * cellHeight

                if ((i + j) % 2 === 0) {
                    // Triangle pointing upwards
                    let tri = new Polygon([
                        [baseX, baseY + cellHeight],
                        [baseX + halfWidth, baseY],
                        [baseX + cellWidth, baseY + cellHeight],
                    ])
                    triangles.push(tri)
                } else {
                    // Triangle pointing downwards
                    let tri = new Polygon([
                        [baseX, baseY],
                        [baseX + halfWidth, baseY + cellHeight],
                        [baseX + cellWidth, baseY],
                    ])
                    triangles.push(tri)
                }
            }
        }
        return triangles
    }

    #generateCell(row, col, cellWidth, cellHeight) {
        let x = this.pos[0] + col * cellWidth
        let y = this.pos[1] + row * cellHeight
        return new Rectangle([x, y], [cellWidth, cellHeight])
    }
}

export function grid(pos, size, rows, cols) {
    return new Grid(pos, size, rows, cols)
}
