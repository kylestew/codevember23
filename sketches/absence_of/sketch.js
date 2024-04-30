import { createCanvas, setCanvasRange } from 'canvas-utils'
import { circle, polygon, vertices } from '@thi.ng/geom'
import { iterator, comp, trace, mapIndexed, partition } from '@thi.ng/transducers'
import { draw } from '@thi.ng/hiccup-canvas'

// define polygon wedges
const WEDGE_COUNT = 24
const coloredWedges = iterator(
    comp(
        // partition pairs of points
        partition(2, 1, true),
        // trace(),
        // convert to polygons and color them
        mapIndexed((idx, pt_pair) => {
            const pt0 = pt_pair[0]
            const pt1 = pt_pair[1] ?? [1, 0]
            return polygon([pt0, pt1, [0, 0]], { fill: `hsl(${(idx / WEDGE_COUNT) * 360}, 100%, 50%)` })
        })
    ),
    // vertices around a circle
    vertices(circle([0, 0], 1), WEDGE_COUNT + 1)
)

const ctx = createCanvas(800, 600, 'sketchCanvas')
setCanvasRange(ctx, -1.1, 1.1)
draw(ctx, ['g', { __background: '#333344' }, ...coloredWedges])

/*
#%%
from functools import partial

import geom.data as dat
import geom.ops as ops
import geom.random as rand

from lib.circle_pack import loosely_pack_circles, compute_area
from lib.grav_sim import grav_sim_black_hole_in_a_box


# == DISPLAY SETUP ================
# printing size: A4 [8.5" x 11"] --> canvas bounds: [(0, 0), (8.5, 11)] --> pixels size: [850, 1100]
import geom_cairo as ctx
pos, size = ctx.setup_dpi(size=[8.5, 11], ppi=200, clear_color=[1, 1, 1])
# safe area
canvas_bounds = dat.Rect(pos, size).inset_by(0.5)
ctx.draw(canvas_bounds, attribs={ctx.STROKE: (0, 1, 1)})
# =================================


##== PARAMS ==##
MIN_STRUCTURE_RAD = 1.2
MAX_STRUCTURE_RAD = 3.0
MAX_LARGE_STRUCTURES = 3

# RAD_NOISE = 0.08 # lower = more similar
# FAILURE_LIMIT = 5000

MIN_GROWTH_CIRCLE = 0.004
FAILED_STARTS = 12
GROWTH_STEP = 0.0002

# REPACK_LARGEST_N = 3
# INFILL_DENSITY_DIV = 2.0

# CIRCLE_CIRCLE_DENSITY = 512.0
##============##

## I: loosly circle pack canvas safe area
circle_bounds = canvas_bounds.inset_by(1.0)
rand_fn = partial(rand.gaussian_point_in, circle_bounds)
placed = loosely_pack_circles(MAX_LARGE_STRUCTURES, MIN_STRUCTURE_RAD, MAX_STRUCTURE_RAD, circle_bounds, rand_fn)

## II: attempt to squish circles together (using gravity sim)
circles = grav_sim_black_hole_in_a_box(circle_bounds, placed)
placed = [dat.Circle(pos, r) for (pos, r) in circles]

# III: draw lines in positions that contain no shapes
def intersects_set(dats, obj):
    for itm in dats:
        if ops.intersects(itm, obj):
            return True
    return False

def line_not_intersecting_circle(circles):
    failure = 0
    while failure < 2048:
        a = rand.gaussian_point_in(canvas_bounds, sigma=0.8)
        b = rand.gaussian_point_in(canvas_bounds, sigma=0.8)
        line = dat.Line(a, b)

        if intersects_set(circles, line):
            failure += 1
        else:
            return line


lines = []
for _ in range(4096 * 2):
    line = line_not_intersecting_circle(placed)
    if line != None:
        lines.append(line)

# == DISPLAY ======================
ctx.clear([1, 1, 1])

# ctx.draw(placed, attribs={ctx.FILL: [0, 0, 0, 0.1]})
# ctx.draw(pts, attribs={ctx.FILL: [1, 0, 0, 1]})
ctx.draw(lines, attribs={ctx.STROKE: [0, 0, 0, 0.12]})

# ctx.display()
ctx.write_out()
# =================================
*/
