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
import ctx
from lib.param import *
from numpy import pi

# == SETUP PARAMS ================
RAY_COUNT = 1
INNER_RAD = 2
OUTER_RAD = 3

SHATTER_COUNT = 4

INNER_ROT = 6
OUTER_ROT = 7

COLOR = 8
LINE_WIDTH = 9

STEP = 10

params = {
    STEP: FloatParam("Step", min_value=0, max_value=1, default=0),
    RAY_COUNT: FloatParam("Ray Count", min_value=3, max_value=256, default=32),
    INNER_RAD: FloatParam("Inner Rad", min_value=0, max_value=2, default=0.5),
    OUTER_RAD: FloatParam("Outer Rad", min_value=0, max_value=2, default=0.5),
    SHATTER_COUNT: FloatParam("Shatters", min_value=0, max_value=16, default=9),
    INNER_ROT: FloatParam(
        "Inner Rotate", min_value=-pi, max_value=pi, default=0.0
    ),
    OUTER_ROT: FloatParam(
        "Outer Rotate", min_value=-pi, max_value=pi, default=0.0
    ),
    COLOR: ColorParam("Color", default=[1, 0, 1, 1]),
    LINE_WIDTH: FloatParam(
        "Line Width", min_value=0.1, max_value=8, default=2.0
    ),
}
# ===============================

# == RENDER ======================
from geom.circle import Circle
from geom.line import Line
from numpy import array, linspace, sort
from numpy.random import rand
from lib.field import FractalNoise2DField

field = FractalNoise2DField((256, 256), (16, 16), seed=4)
fn = field.fn(((0, 1), (0, 1)))


def create_rays(a, b, splits, y_offset):
    # create line
    line = Line(a, b)
    # create n sampling offsets
    samp_x = linspace(0, 1, splits)

    # sample for break positions
    outp = []
    step_n = params[STEP].value
    for x in samp_x:
        samp_y = (y_offset + step_n) % 1
        n = fn(x, samp_y) + 0.5
        n = max(min(n, 1), 0)
        outp.append(n)
    outp = sort(array(outp))

    # break into segments at sampled positions
    segments = line.shatter(outp)

    # remove every other segment
    return segments[0::2]


def render():
    ctx.clear([0, 0, 0, 1])
    ctx.set_range(-1, 1)

    ctx.set_color(params[COLOR].value)
    ctx.set_line_width(params[LINE_WIDTH].value)
    ctx.set_line_cap(1)

    # shape arrays around void circle
    rays = []
    cx, cy = (0, 0)
    count = int(params[RAY_COUNT].value)
    innerRad = params[INNER_RAD].value
    inner = Circle(cx, cy, innerRad)
    outerRad = innerRad + params[OUTER_RAD].value
    outer = Circle(cx, cy, outerRad)
    inner = inner.rotate(params[INNER_ROT].value)
    outer = outer.rotate(params[OUTER_ROT].value)

    shatter_count = int(params[SHATTER_COUNT].value)

    # rays are connector points between inner and outer circle
    t = linspace(0, 1, count)
    for endpoints in zip(inner.vertices(n=count), outer.vertices(n=count), t):
        a, b, t = endpoints
        segs = create_rays(a, b, shatter_count, t)
        rays += segs

    for ray in rays:
        ray.draw(ctx)


# ================================

#%%
# == PROTOTYPE ===================
#%load_ext helpers.ipython_cairo
ctx._setup(600, 600)

params[STEP].value = 0.46
# params[SHATTER_COUNT].value = 0
# params[SIZE].value = 0.7
# params[COLOR].value = [1, 1, 0, 1]
# params[FILL].value = True
# params[POINT].value = [0.2, 0.7]

render()
ctx._ctx
# ================================

*/
