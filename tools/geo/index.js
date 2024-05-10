/*
=== TYPES ===
+ Arc
+ Circle
+ (Cubic)
+ Ellipse
+ (Group)
+ Line
+ Polygon
+ Polyline
+ Rectangle
*/
export { Circle, Line, Polygon } from './types'

/*
=== OPS ===
+ area()
+ asPath() - convert shape to Path2D
+ asPolygon()
+ bounds()
+ center() - center shape around origin or point
+ centroid() - computer shape centroid
+ edges() - extract edges
+ fitIntoBounds() - rescale/reposition shapes into a destination boundary
+ offset() - shape/path offsetting
+ pointAt() - compute point on shape boundary at parametric position
+ pointInside() - check if point inside shape 
+ resample() - resample/convert shape
+ rotate() - rotate shape
+ scale() - scale shape
+ scatter() - create random points inside a shape boundary
+ splitAt() - split shape/boundary at parametric position
+ transform() - apply transformation matrix
+ translate() - translate shape
+ vertices() - extract/sample vertices from shape boundary
*/

/* https://github.com/thi-ng/umbrella/tree/develop/packages/geom */
export { asPath, vertices } from './ops'
