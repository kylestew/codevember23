import { Circle, asPath } from '../geo'

export function draw(ctx, geo, attribs = {}) {
    ctx.save()

    // if an array, run draw on each element
    if (Array.isArray(geo)) {
        // if an array of two numbers, assume it's a point and draw as a circle
        if (geo.length === 2 && typeof geo[0] === 'number' && typeof geo[1] === 'number') {
            const rad = attribs.weight || 0.01
            draw(ctx, new Circle(geo, rad), attribs)
            return
        }

        geo.forEach((g) => draw(ctx, g, attribs))
        return
    }

    let hasStroke = false
    let hasFill = false
    if (attribs.fill && attribs.fill !== 'none') {
        ctx.fillStyle = attribs.fill
        hasFill = true
    }
    if (attribs.stroke) {
        ctx.strokeStyle = attribs.stroke
        hasStroke = true
    }
    if (attribs.weight) {
        ctx.lineWidth = attribs.weight
    }
    if (attribs.lineCap) {
        ctx.lineCap = attribs.lineCap
    }

    // geo attribs override
    if (geo.attribs !== undefined && geo.attribs.fill && geo.attribs.fill !== 'none') {
        ctx.fillStyle = geo.attribs.fill
        hasFill = true
    }
    if (geo.attribs && geo.attribs.stroke) {
        ctx.strokeStyle = geo.attribs.stroke
        hasStroke = true
    }
    if (geo.attribs && geo.attribs.weight) {
        ctx.lineWidth = geo.attribs.weight
    }
    if (geo.attribs && geo.attribs.lineCap) {
        ctx.lineCap = geo.attribs.lineCap
    }

    // perform drawing
    if (hasFill) {
        ctx.fill(asPath(geo))
    }
    if (hasStroke) {
        ctx.stroke(asPath(geo))
    }

    ctx.restore()
}
