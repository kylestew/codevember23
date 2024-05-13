/* === TYPES === */
export {
    // Arc
    Circle,
    // (Cubic)
    // Ellipse
    // (Group)
    Line,
    Polygon,
    // Polyline
    Rectangle,
} from './shapes'

/* === OPS === */
export {
    area,
    asPath, // convert shape to Path2D
    asPolygon,
    bounds,
    // center() - center shape around origin or point
    centerRotate, // center shape around origin point
    // edges() - extract edges
    centroid, // computer shape centroid
    // fitIntoBounds() - rescale/reposition shapes into a destination boundary
    // offset() - shape/path offsetting
    pointAt, // compute point on shape boundary at parametric position
    pointInside, // check if point inside shape
    // resample() - resample/convert shape
    rotate,
    // scale() - scale shape
    scatter,
    // transform() - apply transformation matrix
    translate,
    vertices,
} from './ops'
