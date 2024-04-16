import { SketchParams } from './types'
import { CanvasSketch, SketchState } from './util/Sketch'
import tinycolor from 'tinycolor2'
import { APC, asPolygon, asSvg, svgDoc } from '@thi.ng/geom'
import { transduce, push, comp, filter, mapcat, map, trace } from '@thi.ng/transducers'
import { Path, circle, translate, scale } from '@thi.ng/geom'
import { SYSTEM } from '@thi.ng/random'
import { draw } from '@thi.ng/hiccup-canvas'
import { svgToPaths } from './lib/svg_path_reader'

import SVG from './assets/glyphs.svg?raw'

export class MySketch extends CanvasSketch {
    // private iteration = 0
    private shapes: Path[] = []

    appElm: HTMLElement

    constructor(params: SketchParams, appElm: HTMLElement) {
        super(params, appElm, 100)
        this.appElm = appElm
    }

    setup() {
        // this.iteration = 0
        this.shapes = svgToPaths(SVG)
    }

    next(): SketchState {
        const color = tinycolor(this.params.tint).toRgbString()
        const attrs = { fill: color }

        this.shapes = this.shapes.map((shape) => {
            shape.attribs = attrs

            // randomly scale and distribute
            return translate(scale(shape, SYSTEM.float()), [
                (SYSTEM.float() - 0.5) * 2,
                (SYSTEM.float() - 0.5) * 2,
            ]) as Path
        })

        // TODO: not reading circles correctly
        // M500,0c276.1,0,500,223.9,500,500s-223.9,500-500,500S0,776.1,0,500,223.9,0,500,0Z
        // M500,0C776.100,0,1000,223.900,1000,500C1000,500,776.100,1000,500,1000C500,1000,0,776.100,0,500C0,500,223.900,0,500,0V0Z

        // TODO: why is the circle formed wrong?

        // this.shapes[0] = translate(this.shapes[0], [-0.5, -0.5]) as Path
        // this.shapes[1] = translate(this.shapes[1], [-1.0, -1.0]) as Path
        // this.shapes[2] = translate(this.shapes[2], [0.0, -1.0]) as Path
        // this.shapes[3] = translate(this.shapes[3], [0.0, 0.0]) as Path

        this.render()
        return { status: 'stopped', progress: 0 }
    }

    private render() {
        const bgColor = tinycolor(this.params.background)
        draw(this.ctx, ['g', { __background: bgColor.toRgbString() }, ...this.shapes])

        // this.appElm.innerHTML = asSvg(
        //     svgDoc({ fill: 'black' }, ...this.shapes.map((shape) => scale(shape, [1000, 1000])))
        // )
        // document.body.innerHTML = asSvg(svgDoc({ stroke: 'blue' }, ...circles))
    }
}
