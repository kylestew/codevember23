import { Circle, circle } from '../tools/geo'
import { bounds, offset } from '../tools/geo'
import { CanvasPacker } from '../tools/algos/glyph-packer'
import { draw } from '../tools/draw'
import { animate } from '../tools/canvas-utils/animate'

export function circlePacking(ctx, palette) {
    const [bg, primary, secondary] = palette

    const circ = new Circle([100, 100], 50)

    // TODO: glyph packer will also need to be scaled
    // ctx.resetTransform()

    // TODO: note you need to offset the bounds by the stroke weight
    // draw(ctx, circ, { stroke: '#ffffff', weight: 4.0 })
    // draw(ctx, offset(bounds(circ), 0.015), { stroke: '#ff0000', weight: 0.001 })

    // const packer = new CanvasPacker(ctx.canvas.width, ctx.canvas.height)

    // const circleRenderer = (circ) => {
    //     return (ctx) => {
    //         draw(ctx, circ, { fill: '#000' })
    //     }
    // }

    // // TODO: pack a ton of them
    // if (packer.canPlaceShape(bounds(circ), circleRenderer(circ))) {
    //     console.log('can place')
    //     packer.commitShape(circleRenderer(circ))
    // }

    // //     // packer.dumpDebugCanvas('glyph')
    // // packer.dumpDebugCanvas('packed')
    // packer.dumpDebugCanvas('packed')
}
