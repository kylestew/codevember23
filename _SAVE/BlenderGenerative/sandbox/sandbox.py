import bpy
from mathutils import *

D = bpy.data
C = bpy.context

# Create a cube
bpy.ops.mesh.primitive_cube_add(
    size=4, enter_editmode=False, align="WORLD", location=(0, 0, 0)
)
