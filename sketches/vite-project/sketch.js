import { createCanvas } from 'canvas-utils'
import { rect, circle } from '@thi.ng/geom'
import { draw } from '@thi.ng/hiccup-canvas'

const ctx = createCanvas(800, 600, 'sketchCanvas')
ctx.background('#e2e2e2')

const square = rect([100, 100], [200, 200])
square.attribs = { fill: '#ff3344' }
draw(ctx, square)

draw(ctx, circle([300, 300], 100, { fill: '#3344ff' }))
