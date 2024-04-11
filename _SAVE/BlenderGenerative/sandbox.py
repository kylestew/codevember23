# context.area: VIEW_3D
import bpy

# Number of cubes on each axis.
count = 7

# Range used with for-loops.
count_range = range(0, count, 1)

# Size of grid.
extents = 2.0

# To convert abstract grid position within loop to real-world coordinate.
inv_count = 1.0 / (count - 1.0)
diff = extents + extents

# Spacing between cubes.
padding = 0.025

# Size of each cube.
sz_cube = (diff / count) - padding

# Center of grid.
z_center = 0.0
y_center = 0.0
x_center = 0.0

# Loop through grid z axis.
for i in count_range:

    # Convert from index to percent in range [0.0, 1.0],
    # then convert from prc to real world coordinate.
    # Equivalent to map(val, lb0, ub0, lb1, ub1).
    i_prc = i * inv_count
    z = -extents + i_prc * diff
    z = z + z_center
    blue = i_prc

    # Loop through grid y axis.
    for j in count_range:
        j_prc = j * inv_count
        y = -extents + j_prc * diff
        y = y + y_center
        green = j_prc

        # Loop through grid x axis.
        for k in count_range:
            k_prc = k * inv_count
            x = -extents + k_prc * diff
            x = x + x_center
            red = k_prc

            # Combine x, y and z into a tuple.
            location = (x, y, z)

            # Add grid world position to cube local position.
            bpy.ops.mesh.primitive_cube_add(location=location, size=sz_cube)

            # Cache the current object being worked on.
            # current = bpy.context.object
            current = bpy.context.view_layer.objects.active

            # String interpolation. Placeholders between curly
            # braces will be replaced by value of k, j, i.
            current.name = "Cube ({0}, {1}, {2})".format(k, j, i)
            current.data.name = "Mesh ({0}, {1}, {2})".format(k, j, i)

            # Create a material.
            mat_name = "Material ({0}, {1}, {2})".format(k, j, i)
            mat = bpy.data.materials.new(name=mat_name)

            # Assign a diffuse color to the material.
            mat.diffuse_color = (red, green, blue, 1.0)
            current.data.materials.append(mat)
