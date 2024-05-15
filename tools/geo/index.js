/* === TYPES === */
export {
    // Arc
    Circle,
    // (Cubic)
    // Ellipse
    // (Group)
    Line,
    Polygon,
    Polyline,
    Rectangle,
} from './shapes'

/* === OPS === */
export {
    area,
    asPath, // convert shape to Path2D
    asPoints, // convert shape to its vertices
    asPolygon, // convert shape to polygon(s)
    // asPolyline - convert shape to polyline(s)
    bounds,
    // center() - center shape around origin or point
    centerRotate, // center shape around origin point
    centroid, // computer shape centroid
    // edges() - extract edges
    // fitIntoBounds() - rescale/reposition shapes into a destination boundary
    offset, // shape/path offsetting
    pointAt, // compute point on shape boundary at parametric position
    pointInside, // check if point inside shape
    resample, // resample/convert shape
    rotate,
    // scale() - scale shape
    scatter,
    // splitAt() - split shape/boundary at parametric position
    // tangentAt() - compute tangent at parametric position
    // transform() - apply transformation matrix
    translate,
    // withAttribs() - shallow copy of given shape with new attribs assigned
} from './ops'
