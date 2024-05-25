import { Line } from '../../tools/geo/shapes'
import { Grid } from '../../tools/geo/extended/grid'
import { zip } from '../../tools/array'
import { perlin2, perlin3 } from '../../tools/random/noise'
import { draw } from '../../tools/draw'

export function noiseExample(ctx, palette) {
    const [bg, primary, secondary] = palette

    const grid = new Grid([-1, -1], [2, 2], 32, 32)

    const points = grid.centers()

    function render(time) {
        const zSpeed = 0.0001
        const noiseScale = [0.3, 0.5]
        const noiseOffset = [time * 0.0002, time * 0.0001]

        const angles = points.map(
            ([x, y]) =>
                2.0 *
                Math.PI *
                perlin3(x * noiseScale[0] + noiseOffset[0], y * noiseScale[1] + noiseOffset[1], time * zSpeed)
        )

        const lineLength = 0.05
        const lines = zip(points, angles).map(([pt, angle]) => Line.withCenter(pt, angle, lineLength))

        ctx.clear(bg)
        draw(ctx, lines, { stroke: primary, weight: 0.01 })

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}
