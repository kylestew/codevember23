function makeCirclePacker(wid, hei, gridDivs, gridPadding) {
    this.wid = wid
    this.hei = hei

    // gridDivs (grid divisions) number of cells we want to split the grid into
    this.gridDivs = gridDivs
    this.pad = gridPadding

    // size of the grid cells
    this.gridSizeX = this.wid / this.gridDivs
    this.gridSizeY = this.hei / this.gridDivs

    this.items = []

    this.generateGrid = function () {
        const grid = []
        for (let x = 0; x < this.gridDivs; x++) {
            grid[x] = []
            for (let y = 0; y < this.gridDivs; y++) {
                grid[x][y] = {
                    x,
                    y,
                    c: [],
                }
            }
        }
        this.grid = grid
    }

    this.generateGrid()

    // utility to check distance between two circles
    this.circleDistance = function (c1, c2) {
        return (c1.x - c2.x) ** 2 + (c2.y - c1.y) ** 2 - (c1.r / 2 + c2.r / 2) ** 2
    }

    // given an x and y coordinate, returns the grid cell it falls into
    this.getTile = function (x, y) {
        return this.grid[floor(x / this.gridSizeX)][floor(y / this.gridSizeY)]
    }

    // get all circles which collide with the current position
    this.getCircles = function (x, y) {
        const tile = this.getTile(x, y)
        const circles = []
        tile.c.forEach((c) => {
            if (
                this.circleDistance(c, {
                    x,
                    y,
                    r: 0,
                }) < 0
            )
                circles.push(c)
        })
        return circles
    }

    // gets tiles that are touched by a certain circle
    this.getGridTilesAround = function (x, y, r) {
        const tl = [floor((x - r - this.pad) / this.gridSizeX), floor((y - r - this.pad) / this.gridSizeY)]

        const br = [floor((x + r + this.pad) / this.gridSizeX), floor((y + r + this.pad) / this.gridSizeY)]

        //console.log(tl, br)
        const tiles = []
        for (let i = tl[0]; i <= br[0]; i++) {
            for (let j = tl[1]; j <= br[1]; j++) {
                //console.log(i, j)
                if (i < 0 || j < 0 || i >= this.gridDivs || j >= this.gridDivs) continue
                tiles.push(this.grid[i][j])
            }
        }

        //console.log(tiles)
        return tiles
    }

    this.addCircle = function (c) {
        // break early if out of grid
        if (c.x - c.r < 0 || c.x + c.r > this.wid || c.y - c.r < 0 || c.y + c.r > this.hei) {
            return null
        }

        // get grid items it could intersect
        // basically check which tiles the circle to be added is touching
        const gridTiles = this.getGridTilesAround(c.x, c.y, c.r)

        // Need to add the circle to each one of the grids arrays
        // need to add the tiles to the circle's array
        gridTiles.forEach((t) => {
            this.grid[t.x][t.y].c.push(c)
            if (!c.t) c.t = []
            c.t.push(`${t.x},${t.y}`)
        })
        this.items.push(c)
        return c
    }

    this.tryToAddCircle = function (x, y, minRadius = 3, maxRadius = 200, actuallyAdd = true) {
        let c1 = {
            x,
            y,
            r: minRadius,
            t: [],
        }

        while (true) {
            // break early if out of grid
            if (c1.x - c1.r < 0 || c1.x + c1.r > this.wid || c1.y - c1.r < 0 || c1.y + c1.r > this.hei) {
                return null
            }

            // get grid items it could intersect
            const gridTiles = this.getGridTilesAround(x, y, c1.r)

            //console.log(gridTiles)

            // check against all circles
            for (let tile of gridTiles) {
                for (let c2 of tile.c) {
                    const d = this.circleDistance(c1, c2)

                    if (d - this.pad < 0) {
                        if (c1.r === minRadius) {
                            return null

                            console.log('aborted here')
                        } else {
                            if (actuallyAdd) {
                                // add to tiles, and tiles to circles
                                gridTiles.forEach((t) => {
                                    this.grid[t.x][t.y].c.push(c1)
                                    c1.t.push(`${t.x},${t.y}`)
                                })
                                this.items.push(c1)
                            }

                            return c1
                        }
                    }
                }
            }

            c1.r += 1
            if (c1.r > maxRadius) {
                if (actuallyAdd) {
                    // add to tiles, and tiles to circles
                    gridTiles.forEach((t) => {
                        this.grid[t.x][t.y].c.push(c1)
                        c1.t.push(`${t.x},${t.y}`)
                    })
                    this.items.push(c1)
                }
                //console.log('actually returned here')

                return c1
            }
        }
    }

    this.tryToAddShape = function (circles, actuallyAdd = true) {
        for (let c of circles) {
            if (!this.tryToAddCircle(c.x, c.y, c.r, c.r, false)) {
                return null
            }
        }
        if (actuallyAdd) {
            circles.forEach((c) => this.addCircle(c))
        }
        return circles
    }
}

function makeRectangularShape(sizeW, sizeH) {
    this.original = []
    this.circles = []

    this.sizeW = sizeW
    this.sizeH = sizeH

    //this.rotation = (rotation == 'rand')?random(TAU):rotation;

    this.makeOriginal = function () {
        for (let a = PI / 4; a < TAU + PI / 4; a += TAU / 4) {
            // https://math.stackexchange.com/a/279209/673569
            let ax = 0.5 * this.sizeW * Math.sign(cos(a))
            let ay = 0.5 * this.sizeH * Math.sign(sin(a))

            let axn = 0.5 * this.sizeW * Math.sign(cos(a + PI / 2))
            let ayn = 0.5 * this.sizeH * Math.sign(sin(a + PI / 2))

            for (let inter = 0; inter < 1; inter += 0.02) {
                let xi = ax * inter + axn * (1 - inter)
                let yi = ay * inter + ayn * (1 - inter)

                this.original.push({ x: xi, y: yi, r: this.sizeW / 24 })
            }
        }

        this.circles = this.original.map((c) => ({
            ...c,
        }))
    }

    this.scaleRotateTranslate = function (scale, rotateRadians, translateX, translateY) {
        this.circles = []
        this.original.forEach((c) => {
            const x = c.x * scale
            const y = c.y * scale
            const r = c.r * scale
            // rotate and translate each x and y
            const x2 = x * Math.cos(rotateRadians) - y * Math.sin(rotateRadians) + translateX
            const y2 = x * Math.sin(rotateRadians) + y * Math.cos(rotateRadians) + translateY

            this.circles.push({
                x: x2,
                y: y2,
                r,
            })
        })
    }
}

function makeTriangularShape(size) {
    this.original = []
    this.circles = []

    this.size = size

    this.sizeParam = [random(0.25, 1.5), random(0.25, 1.5), random(0.25, 1.5)]
    //this.sizeParam = [1,1,.5]

    this.makeOriginal = function () {
        let count = 0
        for (let a = 0; a < TAU; a += TAU / 3) {
            // https://math.stackexchange.com/a/279209/673569
            let ax = this.size * cos(a) * this.sizeParam[count]
            let ay = this.size * sin(a) * this.sizeParam[count]

            let axn = this.size * cos(a + TAU / 3) * this.sizeParam[(count + 1) % 3]
            let ayn = this.size * sin(a + TAU / 3) * this.sizeParam[(count + 1) % 3]

            for (let inter = 0; inter < 1; inter += 0.05) {
                let xi = ax * inter + axn * (1 - inter)
                let yi = ay * inter + ayn * (1 - inter)

                this.original.push({ x: xi, y: yi, r: this.size / 12 })
            }

            count++
        }

        this.circles = this.original.map((c) => ({
            ...c,
        }))
    }

    this.scaleRotateTranslate = function (scale, rotateRadians, translateX, translateY) {
        this.circles = []
        this.original.forEach((c) => {
            const x = c.x * scale
            const y = c.y * scale
            const r = c.r * scale
            // rotate and translate each x and y
            const x2 = x * Math.cos(rotateRadians) - y * Math.sin(rotateRadians) + translateX
            const y2 = x * Math.sin(rotateRadians) + y * Math.cos(rotateRadians) + translateY

            this.circles.push({
                x: x2,
                y: y2,
                r,
            })
        })
    }
}

function makeEmptyCircle(size) {
    this.original = []
    this.circles = []

    this.size = size

    this.makeOriginal = function () {
        let count = 0
        for (let a = 0; a < TAU; a += TAU / 50) {
            let ax = (this.size * cos(a)) / 2
            let ay = (this.size * sin(a)) / 2

            this.original.push({ x: ax, y: ay, r: this.size / 20 })
        }

        this.circles = this.original.map((c) => ({
            ...c,
        }))
    }

    this.scaleRotateTranslate = function (scale, rotateRadians, translateX, translateY) {
        this.circles = []
        this.original.forEach((c) => {
            const x = c.x * scale
            const y = c.y * scale
            const r = c.r * scale
            // rotate and translate each x and y
            const x2 = x * Math.cos(rotateRadians) - y * Math.sin(rotateRadians) + translateX
            const y2 = x * Math.sin(rotateRadians) + y * Math.cos(rotateRadians) + translateY

            this.circles.push({
                x: x2,
                y: y2,
                r,
            })
        })
    }
}

function drawRect(x, y, rotation, scale, sizeW, sizeH) {
    push()
    rectMode(CENTER)

    translate(x, y)
    rotate(rotation)

    stroke(random(palette))
    strokeWeight(2.5)
    fill(random(palette))
    noFill()
    rect(0, 0, sizeW * scale, sizeH * scale, 5)

    pop()
}

function drawCircle(x, y, scale, size) {
    noFill()
    stroke(random(palette))
    strokeWeight(2.5)
    ellipse(x, y, size * scale)
}

function drawTriangle(x, y, rotation, scale, size, ts) {
    push()
    rectMode(CENTER)

    translate(x, y)

    noFill()

    stroke(random(palette))
    strokeWeight(2.5)

    let vertices = []
    let count = 0
    for (let a = 0; a < TAU; a += TAU / 3) {
        let x = size * cos(a + rotation) * scale * ts[count]
        let y = size * sin(a + rotation) * scale * ts[count]

        vertices.push({ x: x, y: y })
        count++
    }

    roundedPoly(ctx, vertices, 10)
    ctx.stroke()

    pop()
}

circles = []
images = []

const MIN_SCALE = 5
const MAX_SCALE = 300
const SCALE_INCREMENT = 0.1
const NUM_ITEM_PLACE_TRIES = 2000

function packShapes() {
    for (let i = 0; i < NUM_ITEM_PLACE_TRIES; i++) {
        let currentScale = MIN_SCALE
        let x = random(windowWidth)
        let y = random(windowHeight)
        let rotateRadians = random(TAU) //noise(x*0.0005,y*0.0005)*TAU
        let lastAdded = null
        let lastAddedImage = null

        let randW = random(1, 15)
        let randH = random(1, 15)

        let type = random(['R', 'T', 'C'])

        // get a shape to draw
        let currentShape = 0
        if (type == 'R') {
            currentShape = new makeRectangularShape(randW, randH)
        } else if (type == 'T') {
            currentShape = new makeTriangularShape(randW)
        } else {
            currentShape = new makeEmptyCircle(randW)
        }
        // let currentShape = (type=='R')?new makeRectangularShape(randW, randH):new makeTriangularShape(randW);
        currentShape.makeOriginal()

        while (currentScale < MAX_SCALE) {
            currentShape.scaleRotateTranslate(currentScale, rotateRadians, x, y)
            const added = circlePacker.tryToAddShape(currentShape.circles, false)

            // shape can't be placed break
            if (!added && !lastAdded) break

            // shape can't grow anymore, add the previous version
            if (!added && lastAdded) {
                lastAdded.forEach((c) => {
                    circles.push({
                        x: c.x,
                        y: c.y,
                        r: c.r,
                    })
                })

                lastAdded.forEach((c) => circlePacker.addCircle(c))
                images.push(lastAddedImage)
                break

                // shape grew, update
            } else if (added) {
                lastAdded = [...added]

                lastAddedImage = {
                    type: type,
                    x: x,
                    y: y,
                    scale: currentScale,
                    rotation: rotateRadians,
                    sizeW: randW,
                    sizeH: randH,
                    triangleSizes: !currentShape.sizeParam ? 0 : currentShape.sizeParam,
                }
            }
            currentScale += SCALE_INCREMENT
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight)

    pixelDensity(4)
    ctx = canvas.getContext('2d')

    circlePacker = new makeCirclePacker(windowWidth - 50, windowHeight - 50, 200, 3)

    packShapes()

    translate(25, 25)
    // let c = circlePacker.addCircle({
    //   x: random(400),
    //   y: random(400),
    //   r: random(20, 50)
    // })
    // for (let n = 0; n < 3000000; n++) {
    //   let c = circlePacker.tryToAddCircle(random(20), random(20))
    //
    //   console.log(circlePacker.items.length)
    // }
    //
    background(0) //'#fdebd3')
    // for (let n = 0; n < circlePacker.items.length; n++) {
    //   let c = circlePacker.items[n]
    //
    //   ellipse(c.x, c.y, c.r)
    //
    // }

    for (let n = 0; n < images.length; n++) {
        let i = images[n]

        if (i.type == 'R') {
            drawRect(i.x, i.y, i.rotation, i.scale, i.sizeW, i.sizeH)
        } else if (i.type == 'T') {
            drawTriangle(i.x, i.y, i.rotation, i.scale, i.sizeW, i.triangleSizes)
        } else {
            drawCircle(i.x, i.y, i.sizeW, i.scale)
        }
    }

    noLoop()
}

palette = ['#f7f3f2', '#0077e1', '#f5d216', '#fc3503']
//palette = ["#e20404", "#fcd202", "#ffffff", "#000000"]

// To draw you must call between
//    ctx.beginPath();
//    roundedPoly(ctx, points, radius);
//    ctx.stroke();
//    ctx.fill();
// as it only adds a path and does not render.
function roundedPoly(ctx, points, radiusAll, lineTogg) {
    ctx.beginPath()
    var i,
        x,
        y,
        len,
        p1,
        p2,
        p3,
        v1,
        v2,
        sinA,
        sinA90,
        radDirection,
        drawDirection,
        angle,
        halfAngle,
        cRadius,
        lenOut,
        radius
    // convert 2 points into vector form, polar form, and normalised
    var asVec = function (p, pp, v) {
        v.x = pp.x - p.x
        v.y = pp.y - p.y
        v.len = Math.sqrt(v.x * v.x + v.y * v.y)
        v.nx = v.x / v.len
        v.ny = v.y / v.len
        v.ang = Math.atan2(v.ny, v.nx)
    }
    radius = radiusAll
    v1 = {}
    v2 = {}
    len = points.length
    p1 = points[len - 1]
    // for each point
    for (i = 0; i < len; i++) {
        p2 = points[i % len]
        p3 = points[(i + 1) % len]
        //-----------------------------------------
        // Part 1
        asVec(p2, p1, v1)
        asVec(p2, p3, v2)
        sinA = v1.nx * v2.ny - v1.ny * v2.nx
        sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny
        angle = Math.asin(sinA < -1 ? -1 : sinA > 1 ? 1 : sinA)
        //-----------------------------------------
        radDirection = 1
        drawDirection = false
        if (sinA90 < 0) {
            if (angle < 0) {
                angle = Math.PI + angle
            } else {
                angle = Math.PI - angle
                radDirection = -1
                drawDirection = true
            }
        } else {
            if (angle > 0) {
                radDirection = -1
                drawDirection = true
            } else {
                angle = TAU + angle
            }
        }

        if (p2.radius !== undefined) {
            radius = p2.radius
        } else {
            radius = radiusAll
        }
        //-----------------------------------------
        // Part 2
        halfAngle = angle / 2
        //-----------------------------------------

        //-----------------------------------------
        // Part 3
        lenOut = Math.abs((Math.cos(halfAngle) * radius) / Math.sin(halfAngle))
        //-----------------------------------------

        //-----------------------------------------
        // Special part A
        if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
            lenOut = Math.min(v1.len / 2, v2.len / 2)
            cRadius = Math.abs((lenOut * Math.sin(halfAngle)) / Math.cos(halfAngle))
        } else {
            cRadius = radius
        }
        //-----------------------------------------
        // Part 4
        x = p2.x + v2.nx * lenOut
        y = p2.y + v2.ny * lenOut
        //-----------------------------------------
        // Part 5
        x += -v2.ny * cRadius * radDirection
        y += v2.nx * cRadius * radDirection
        //-----------------------------------------

        // for(let pointAngle = v1.ang + (Math.PI / 2) * radDirection;
        //         pointAngle < v2.ang - (Math.PI / 2) * radDirection; pointAngle += 0.1 ){
        //
        //           let xangp = cRadius * cos(pointAngle)
        //           let yangp = cRadius * sin(pointAngle)
        //
        //           point(xangp, yangp)
        //         }
        // Part 6
        ctx.arc(
            x,
            y,
            cRadius,
            v1.ang + (Math.PI / 2) * radDirection,
            v2.ang - (Math.PI / 2) * radDirection,
            drawDirection
        )
        //-----------------------------------------
        p1 = p2
        p2 = p3
    }
    if (lineTogg) {
        ctx.moveTo(points[0].x, points[0].y)
    }

    ctx.closePath()
}
